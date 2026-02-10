'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactMessage } from '@/types/database'
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  MessageSquare,
  Eye,
} from 'lucide-react'
import styles from './page.module.css'

export default function MessagesPage() {
  const supabase = createClient()

  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterUnread, setFilterUnread] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRead = async (msg: ContactMessage) => {
    const newStatus = !msg.is_read
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: newStatus })
        .eq('id', msg.id)

      if (error) throw error
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
      )
    } catch (err) {
      console.error('Error updating message:', err)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg)
    if (!msg.is_read) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', msg.id)

        if (error) throw error
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        )
      } catch (err) {
        console.error('Error marking message as read:', err)
      }
    }
  }

  const filtered = messages.filter((msg) => {
    if (filterUnread && msg.is_read) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q) ||
        (msg.phone && msg.phone.toLowerCase().includes(q))
      )
    }
    return true
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <span>Loading messages...</span>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Messages</h1>
          <p className={styles.subtitle}>Contact form submissions</p>
        </div>
      </header>

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          Total: <span className={styles.statValue}>{messages.length}</span>
        </div>
        <div className={styles.stat}>
          Unread:{' '}
          <span className={`${styles.statValue} ${unreadCount > 0 ? styles.statUnread : ''}`}>
            {unreadCount}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button
          className={`${styles.filterButton} ${filterUnread ? styles.filterButtonActive : ''}`}
          onClick={() => setFilterUnread(!filterUnread)}
        >
          <Mail size={16} />
          {filterUnread ? 'Show All' : 'Unread Only'}
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare size={48} />
            <p>{search || filterUnread ? 'No messages match your filter' : 'No messages yet'}</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((msg) => (
                <tr key={msg.id} className={!msg.is_read ? styles.rowUnread : undefined}>
                  <td>
                    <div className={styles.senderName}>
                      {!msg.is_read && <span className={styles.unreadDot} />}
                      {msg.name}
                    </div>
                    <div className={styles.senderEmail}>{msg.email}</div>
                  </td>
                  <td>
                    <div
                      className={styles.messagePreview}
                      onClick={() => openMessage(msg)}
                      title="Click to view full message"
                    >
                      {msg.message}
                    </div>
                  </td>
                  <td className={styles.dateText}>{msg.phone || '—'}</td>
                  <td className={styles.dateText}>{formatDate(msg.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => openMessage(msg)}
                        title="View message"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => toggleRead(msg)}
                        title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {msg.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => deleteMessage(msg.id)}
                        title="Delete message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMessage(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Message Details</h2>
              <button
                className={styles.modalClose}
                onClick={() => setSelectedMessage(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <div className={styles.modalLabel}>From</div>
                <div className={styles.modalValue}>
                  {selectedMessage.name} ({selectedMessage.email})
                </div>
              </div>
              {selectedMessage.phone && (
                <div className={styles.modalField}>
                  <div className={styles.modalLabel}>Phone</div>
                  <div className={styles.modalValue}>{selectedMessage.phone}</div>
                </div>
              )}
              <div className={styles.modalField}>
                <div className={styles.modalLabel}>Date</div>
                <div className={styles.modalValue}>{formatDate(selectedMessage.created_at)}</div>
              </div>
              <div className={styles.modalField}>
                <div className={styles.modalLabel}>Message</div>
                <div className={styles.modalMessage}>{selectedMessage.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
