'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Bus, BusClass, MaintenanceStatus } from '@/types/database'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  CheckCircle,
  Wrench,
  XCircle,
  Users,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react'
import styles from './page.module.css'

interface BusesTableProps {
  initialBuses: Bus[]
}

const classColors: Record<BusClass, string> = {
  VIP: '#B8182F',
  Comfort: '#2563eb',
  Standard: '#16a34a',
}

const statusConfig: Record<MaintenanceStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  operational: { label: 'Operational', color: '#16a34a', icon: CheckCircle },
  maintenance: { label: 'Maintenance', color: '#ea580c', icon: Wrench },
  out_of_service: { label: 'Out of Service', color: '#dc2626', icon: XCircle },
}

export default function BusesTable({ initialBuses }: BusesTableProps) {
  const [buses, setBuses] = useState<Bus[]>(initialBuses)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterClass, setFilterClass] = useState<BusClass | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all')
  const [deleteModalBus, setDeleteModalBus] = useState<Bus | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClient()

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const matchesSearch = bus.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesClass = filterClass === 'all' || bus.class === filterClass
      const matchesStatus = filterStatus === 'all' || bus.maintenance_status === filterStatus
      return matchesSearch && matchesClass && matchesStatus
    })
  }, [buses, searchQuery, filterClass, filterStatus])

  const handleDelete = async () => {
    if (!deleteModalBus) return

    setIsDeleting(true)
    try {
      // Delete photos from storage
      if (deleteModalBus.photos && deleteModalBus.photos.length > 0) {
        const filePaths = deleteModalBus.photos
          .map((url) => {
            const parts = url.split('/storage/v1/object/public/bus-images/')
            return parts.length > 1 ? parts[1] : null
          })
          .filter((p): p is string => p !== null)

        if (filePaths.length > 0) {
          await supabase.storage.from('bus-images').remove(filePaths)
        }
      }

      const { error } = await supabase.from('buses').delete().eq('id', deleteModalBus.id)

      if (error) throw error

      setBuses((prev) => prev.filter((b) => b.id !== deleteModalBus.id))
      setDeleteModalBus(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting bus:', error)
      alert('Failed to delete bus. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleActive = async (bus: Bus) => {
    try {
      const { error } = await supabase
        .from('buses')
        .update({ is_active: !bus.is_active })
        .eq('id', bus.id)

      if (error) throw error

      setBuses((prev) =>
        prev.map((b) => (b.id === bus.id ? { ...b, is_active: !b.is_active } : b))
      )
      router.refresh()
    } catch (error) {
      console.error('Error updating bus:', error)
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Bus Fleet Management</h1>
          <p className={styles.subtitle}>
            Manage your fleet of {buses.length} buses
          </p>
        </div>
        <Link href="/admin/buses/new" className={styles.addButton}>
          <Plus size={20} />
          Add New Bus
        </Link>
      </header>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search buses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value as BusClass | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">All Classes</option>
            <option value="VIP">VIP</option>
            <option value="Comfort">Comfort</option>
            <option value="Standard">Standard</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Bus</th>
              <th>Class</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuses.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  {searchQuery || filterClass !== 'all' || filterStatus !== 'all'
                    ? 'No buses match your filters'
                    : 'No buses added yet'}
                </td>
              </tr>
            ) : (
              filteredBuses.map((bus) => {
                const statusInfo = statusConfig[bus.maintenance_status]
                const StatusIcon = statusInfo.icon
                return (
                  <tr key={bus.id}>
                    <td>
                      <div className={styles.busCell}>
                        <div className={styles.busImage}>
                          {bus.photos && bus.photos.length > 0 ? (
                            <Image
                              src={bus.photos[0]}
                              alt={bus.name}
                              fill
                              sizes="48px"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className={styles.noImage}>No image</div>
                          )}
                        </div>
                        <span className={styles.busName}>{bus.name}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.classBadge}
                        style={{
                          backgroundColor: `${classColors[bus.class]}20`,
                          color: classColors[bus.class],
                        }}
                      >
                        {bus.class}
                      </span>
                    </td>
                    <td>
                      <div className={styles.capacityCell}>
                        <Users size={14} />
                        {bus.capacity}
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: `${statusInfo.color}20`,
                          color: statusInfo.color,
                        }}
                      >
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(bus)}
                        className={`${styles.activeToggle} ${bus.is_active ? styles.active : ''}`}
                        title={bus.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {bus.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          href={`/en/buses/${bus.id}`}
                          className={styles.actionButton}
                          title="View on site"
                          target="_blank"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/buses/${bus.id}`}
                          className={styles.actionButton}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteModalBus(bus)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalBus && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModalBus(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <AlertTriangle size={32} />
            </div>
            <h3 className={styles.modalTitle}>Delete Bus</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{deleteModalBus.name}</strong>? This action
              cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setDeleteModalBus(null)}
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
