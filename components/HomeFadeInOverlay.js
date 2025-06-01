import { useEffect, useState } from 'react'
import styles from './homeFadeInOverlay.module.css'

export default function HomeFadeInOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false)
    }, 3000) // duration of fade-out

    return () => clearTimeout(timeout)
  }, [])

  return visible ? (
    <div className={styles.overlay} />
  ) : null
}
