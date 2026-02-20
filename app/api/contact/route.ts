import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

// Validation functions
function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' }
  }
  const trimmedName = name.trim()
  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  if (trimmedName.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' }
  }
  return { valid: true }
}

function validateEmail(email: string): { valid: boolean; error?: string } {
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

function validatePhone(phone?: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: true } // Phone is optional
  const phoneRegex = /^[\d\s\-+()]{7,20}$/
  if (!phoneRegex.test(phone.trim())) {
    return { valid: false, error: 'Invalid phone number format' }
  }
  return { valid: true }
}

function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' }
  }
  const trimmedMessage = message.trim()
  if (trimmedMessage.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' }
  }
  if (trimmedMessage.length > 5000) {
    return { valid: false, error: 'Message must be less than 5000 characters' }
  }
  return { valid: true }
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .slice(0, 5000) // Limit length
}

export async function POST(request: Request) {
  try {
    // Parse request body
    let body: ContactFormData
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email, phone, message } = body

    // Validate all fields
    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      )
    }

    const messageValidation = validateMessage(message)
    if (!messageValidation.valid) {
      return NextResponse.json(
        { error: messageValidation.error },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : null,
      message: sanitizeInput(message),
    }

    // Create Supabase client for API route
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save to Supabase contact_messages table
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        message: sanitizedData.message,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save message. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Contact message saved:', data.id)

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message received successfully',
        id: data.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
