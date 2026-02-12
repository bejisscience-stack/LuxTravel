'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Bus,
  FileText,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import styles from './Sidebar.module.css'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Buses', href: '/admin/buses', icon: Bus },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${!isCollapsed ? styles.overlayVisible : ''}`}
        onClick={() => setIsCollapsed(true)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <Link href="/admin" className={styles.logoLink}>
            LUX<span className={styles.logoAccent}>TRAVEL</span>
            <span className={styles.adminBadge}>Admin</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${active ? styles.active : ''}`}
                    onClick={() => setIsCollapsed(true)}
                  >
                    <Icon size={20} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                    {active && <span className={styles.activeIndicator} />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} className={styles.navIcon} />
            <span className={styles.navLabel}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
