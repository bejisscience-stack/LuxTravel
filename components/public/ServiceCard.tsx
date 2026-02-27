'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './ServiceCard.module.css'

interface ServiceCardProps {
  name: string
  description: string
  imageUrl: string
}

export default function ServiceCard({
  name,
  description,
  imageUrl,
}: ServiceCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      className={`${styles.card} ${hovered ? styles.hovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
      </div>

      <div className={styles.imageContainer}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`${styles.image} ${hovered ? styles.imageHovered : ''}`}
          />
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  )
}
