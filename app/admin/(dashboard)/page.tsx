import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import styles from './page.module.css'
import { Bus, Image, MessageSquare, Eye, Wrench, CheckCircle, Plus, ArrowRight, Mail, Clock } from 'lucide-react'
import type { ContactMessage } from '@/types/database'

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    busesResult,
    activeBusesResult,
    maintenanceBusesResult,
    galleryResult,
    messagesResult,
    unreadResult,
  ] = await Promise.all([
    supabase.from('buses').select('id', { count: 'exact' }),
    supabase.from('buses').select('id', { count: 'exact' }).eq('is_active', true).eq('maintenance_status', 'operational'),
    supabase.from('buses').select('id', { count: 'exact' }).eq('maintenance_status', 'maintenance'),
    supabase.from('gallery').select('id', { count: 'exact' }),
    supabase.from('contact_messages').select('id', { count: 'exact' }),
    supabase.from('contact_messages').select('id', { count: 'exact' }).eq('is_read', false),
  ])

  return {
    totalBuses: busesResult.count || 0,
    activeBuses: activeBusesResult.count || 0,
    maintenanceBuses: maintenanceBusesResult.count || 0,
    totalGalleryImages: galleryResult.count || 0,
    totalMessages: messagesResult.count || 0,
    unreadMessages: unreadResult.count || 0,
  }
}

async function getRecentMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default async function AdminDashboardPage() {
  const [stats, recentMessages] = await Promise.all([
    getDashboardStats(),
    getRecentMessages(),
  ])

  const statCards = [
    {
      label: 'Total Buses',
      value: stats.totalBuses,
      icon: Bus,
      color: '#B8182F',
    },
    {
      label: 'Active Buses',
      value: stats.activeBuses,
      icon: CheckCircle,
      color: '#16a34a',
    },
    {
      label: 'In Maintenance',
      value: stats.maintenanceBuses,
      icon: Wrench,
      color: '#ea580c',
    },
    {
      label: 'Gallery Images',
      value: stats.totalGalleryImages,
      icon: Image,
      color: '#2563eb',
    },
    {
      label: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: '#8b5cf6',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: Eye,
      color: stats.unreadMessages > 0 ? '#dc2626' : '#6b7280',
    },
  ]

  const quickActions = [
    { label: 'Add New Bus', href: '/admin/buses/new', icon: Plus, color: '#B8182F' },
    { label: 'Manage Fleet', href: '/admin/buses', icon: Bus, color: '#2563eb' },
    { label: 'View Messages', href: '/admin/messages', icon: Mail, color: '#16a34a' },
    { label: 'Edit Gallery', href: '/admin/gallery', icon: Image, color: '#8b5cf6' },
  ]

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome to the LuxTravel admin panel</p>
      </header>

      <div className={styles.statsGrid}>
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                <Icon size={24} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.sectionsGrid}>
        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActions}>
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href} className={styles.quickAction}>
                  <div
                    className={styles.quickActionIcon}
                    style={{ backgroundColor: `${action.color}20`, color: action.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className={styles.quickActionLabel}>{action.label}</span>
                  <ArrowRight size={16} className={styles.quickActionArrow} />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recent Messages */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Messages</h2>
            <Link href="/admin/messages" className={styles.viewAllLink}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.messagesList}>
            {recentMessages.length === 0 ? (
              <p className={styles.emptyState}>No messages yet</p>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageItem} ${!message.is_read ? styles.unread : ''}`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.messageName}>{message.name}</span>
                    <span className={styles.messageTime}>
                      <Clock size={12} />
                      {formatTimeAgo(message.created_at)}
                    </span>
                  </div>
                  <p className={styles.messageEmail}>{message.email}</p>
                  <p className={styles.messagePreview}>
                    {message.message.length > 80
                      ? `${message.message.substring(0, 80)}...`
                      : message.message}
                  </p>
                  {!message.is_read && <span className={styles.unreadBadge}>New</span>}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
