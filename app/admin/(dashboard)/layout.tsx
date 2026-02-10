import Sidebar from '@/components/admin/Sidebar'
import styles from './layout.module.css'

export const metadata = {
  title: 'Admin Dashboard | LuxTravel',
  description: 'LuxTravel Administration Panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
