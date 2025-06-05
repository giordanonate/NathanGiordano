import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './navbar.module.css'

let isTransitioning = false

export default function Navbar() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNav = (target) => {
    setIsOpen(false)
    if (isTransitioning) return

    isTransitioning = true
    setTimeout(() => {
      isTransitioning = false
    }, 2400)

    const destination =
      router.pathname === target
        ? `${target}?refresh=${Date.now()}`
        : target

    window.dispatchEvent(
      new CustomEvent('start-transition', { detail: destination })
    )
  }

  const navItems = [
    { src: '/assets/nav/home-1.png', alt: 'Home', target: '/home' },
    { src: '/assets/nav/sketch-1.png', alt: 'Sketchbook', target: '/sketchbook' },
    { src: '/assets/nav/being-1.png', alt: 'BEING', target: '/being' },
    { src: '/assets/nav/superbeing-1.png', alt: 'SUPERBEING', target: '/superbeing' },
  ]

  return (
    <div className={styles.navWrapper}>
      {isMobile && (
        <div className={styles.menuBar}>
          <button
            className={styles.menuButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      )}

      <nav className={styles.nav}>
        {isMobile ? (
          isOpen && (
            <div className={styles.dropdown}>
              {navItems.map(({ src, alt, target }) => (
                <img
                  key={alt}
                  src={src}
                  alt={alt}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(target)
                  }}
                />
              ))}
              <a
                href="https://lightwork.art"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/nav/lightwork-1.png" alt="Light Work" />
              </a>
            </div>
          )
        ) : (
          <>
            {navItems.map(({ src, alt, target }) => (
              <img
                key={alt}
                src={src}
                alt={alt}
                onClick={(e) => {
                  e.preventDefault()
                  handleNav(target)
                }}
              />
            ))}
            <a
              href="https://lightwork.art"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/nav/lightwork-1.png" alt="Light Work" />
            </a>
          </>
        )}
      </nav>
    </div>
  )
}
