import { useRouter } from 'next/router'
import styles from './navbar.module.css'

let isTransitioning = false

export default function Navbar() {
  const router = useRouter()

  const handleNav = (target) => {
    if (isTransitioning) return

    isTransitioning = true
    setTimeout(() => {
      isTransitioning = false
    }, 2400) // duration of full transition cycle (fade out + hold + fade in)

    if (router.pathname === target) {
      const fakeRoute = `${target}?refresh=${Date.now()}`
      window.dispatchEvent(new CustomEvent('start-transition', { detail: fakeRoute }))
    } else {
      window.dispatchEvent(new CustomEvent('start-transition', { detail: target }))
    }
  }

  return (
    <nav className={styles.nav}>
      <img
        src="/assets/nav/home-1.png"
        alt="Home"
        onClick={(e) => { e.preventDefault(); handleNav('/'); }}
      />
      <img
        src="/assets/nav/sketch-1.png"
        alt="Sketchbook"
        onClick={(e) => { e.preventDefault(); handleNav('/sketchbook'); }}
      />
      <img
        src="/assets/nav/being-1.png"
        alt="BEING"
        onClick={(e) => { e.preventDefault(); handleNav('/being'); }}
      />
      <img
        src="/assets/nav/superbeing-1.png"
        alt="SUPERBEING"
        onClick={(e) => { e.preventDefault(); handleNav('/superbeing'); }}
      />
      <a
        href="https://lightwork.art"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/assets/nav/lightwork-1.png"
          alt="Light Work"
        />
      </a>
    </nav>
  )
}
