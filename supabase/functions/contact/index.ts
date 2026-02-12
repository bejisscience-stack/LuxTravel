import { createClient } from '@supabase/supabase-js'
import { getCorsHeaders } from '../_shared/cors.ts'

const corsHeaders = getCorsHeaders('POST, OPTIONS')

// --- Rate limiting (in-memory, per-IP, resets on cold start) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return true
  }

  return false
}

// --- Validation functions ---

interface ValidationResult {
  valid: boolean
  error?: string
}

function validateName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' }
  }
  const trimmed = name.trim()
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' }
  }
  return { valid: true }
}

function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' }
  }
  if (email.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' }
  }
  return { valid: true }
}

function validatePhone(phone?: string): ValidationResult {
  if (!phone) return { valid: true }
  const phoneRegex = /^[\d\s\-+()]{7,20}$/
  if (!phoneRegex.test(phone.trim())) {
    return { valid: false, error: 'Invalid phone number format' }
  }
  return { valid: true }
}

function validateMessage(message: string): ValidationResult {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' }
  }
  const trimmed = message.trim()
  if (trimmed.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' }
  }
  if (trimmed.length > 5000) {
    return { valid: false, error: 'Message must be less than 5000 characters' }
  }
  return { valid: true }
}

// Sanitize input — strip HTML-significant characters and enforce length
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>&"']/g, '')
    .slice(0, 5000)
}

// --- Edge Function handler ---

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  try {
    // Rate limiting by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || 'unknown'

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Parse body
    let body: { name: string; email: string; phone?: string; message: string }
    try {
      body = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { name, email, phone, message } = body

    // Validate
    for (const check of [
      validateName(name),
      validateEmail(email),
      validatePhone(phone),
      validateMessage(message),
    ]) {
      if (!check.valid) {
        return new Response(
          JSON.stringify({ error: check.error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Sanitize
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : null,
      message: sanitizeInput(message),
      is_read: false,
    }

    // Use ANON key only — RLS policies control access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('contact_messages')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save message. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message received successfully', id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Contact function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
