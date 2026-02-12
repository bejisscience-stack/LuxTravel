import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo/Brand Animation */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>LUX</span>
            <span className={styles.logoAccent}>TRAVEL</span>
          </div>
        </div>

        {/* Elegant Loading Indicator */}
        <div className={styles.loader}>
          <div className={styles.loaderLine}></div>
        </div>
      </div>
    </div>
  )
}
