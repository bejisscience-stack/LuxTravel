'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/types/database'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Database,
  Loader2,
} from 'lucide-react'
import styles from './page.module.css'

interface ServicesTableProps {
  initialServices: Service[]
}

export default function ServicesTable({ initialServices }: ServicesTableProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalService, setDeleteModalService] = useState<Service | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClient()

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      return service.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [services, searchQuery])

  const handleDelete = async () => {
    if (!deleteModalService) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/services?id=${deleteModalService.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete service')
      }

      setServices((prev) => prev.filter((s) => s.id !== deleteModalService.id))
      setDeleteModalService(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSeedData = async () => {
    setIsSeeding(true)
    setSeedMessage(null)
    try {
      const response = await fetch('/api/admin/seed-services', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to seed data')
      }

      setSeedMessage('Service data seeded successfully! Refreshing...')
      setTimeout(() => {
        setSeedMessage(null)
        router.refresh()
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error seeding data:', error)
      setSeedMessage('Failed to seed data. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active } as never)
        .eq('id', service.id)

      if (error) throw error

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s))
      )
      router.refresh()
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Services Management</h1>
          <p className={styles.subtitle}>
            Manage your {services.length} mechanic services
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleSeedData}
            className={styles.seedButton}
            disabled={isSeeding}
            title="Populate services with sample data"
          >
            {isSeeding ? <Loader2 size={18} className={styles.spinner} /> : <Database size={18} />}
            {isSeeding ? 'Seeding...' : 'Seed Data'}
          </button>
          <Link href="/admin/services/new" className={styles.addButton}>
            <Plus size={20} />
            Add New Service
          </Link>
        </div>
      </header>

      {seedMessage && (
        <div className={styles.seedMessage}>
          <CheckCircle size={16} />
          {seedMessage}
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.emptyState}>
                  {searchQuery
                    ? 'No services match your search'
                    : 'No services added yet'}
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div className={styles.busCell}>
                      <div className={styles.busImage}>
                        {service.photos && service.photos.length > 0 ? (
                          <Image
                            src={service.photos[0]}
                            alt={service.name}
                            fill
                            sizes="48px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className={styles.noImage}>No image</div>
                        )}
                      </div>
                      <span className={styles.busName}>{service.name}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(service)}
                      className={`${styles.activeToggle} ${service.is_active ? styles.active : ''}`}
                      title={service.is_active ? 'Click to deactivate' : 'Click to activate'}
                    >
                      {service.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/services/${service.id}`}
                        className={styles.actionButton}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteModalService(service)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalService && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModalService(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <AlertTriangle size={32} />
            </div>
            <h3 className={styles.modalTitle}>Delete Service</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{deleteModalService.name}</strong>? This action
              cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setDeleteModalService(null)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmDeleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
