import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Masonry from 'react-masonry-css'
import styles from '../styles/feed.module.css'
import Navbar from '../components/navbar'
import EarthCanvas from '../components/EarthCanvas'

export async function getStaticProps() {
  const res = await fetch('https://delicate-credit-08df.giordanonate.workers.dev/')
  let media = await res.json()

  media = media
    .filter(url => url.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .sort(() => 0.5 - Math.random())
    .slice(0, 100)

  return { props: { media } }
}


export default function Home({ media }) {
  const [visibleCount, setVisibleCount] = useState(12)
  const [shuffled, setShuffled] = useState([])
  const itemRefs = useRef([])

  useEffect(() => {
    document.body.classList.remove('reloading')
  }, [])

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const itemLimit = isMobile ? 50 : 100
    const limited = [...media].sort(() => 0.5 - Math.random()).slice(0, itemLimit)
    setShuffled(limited)
  }, [media])

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.body.offsetHeight
      if (docHeight >= 10000) return
      if (scrollBottom >= docHeight - 1000) {
        setVisibleCount(prev => Math.min(prev + 12, shuffled.length))
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shuffled.length])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains(styles.visible)
        ) {
          entry.target.classList.add(styles.visible)
        }
      })
    }, { threshold: 0.1 })

    itemRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => itemRefs.current.forEach(ref => ref && observer.unobserve(ref))
  }, [visibleCount])

  useEffect(() => {
    setTimeout(() => {
      itemRefs.current.slice(0, visibleCount).forEach(ref => {
        if (ref && !ref.classList.contains(styles.visible)) {
          ref.classList.add(styles.visible)
        }
      })
    }, 50)
  }, [shuffled])

  useEffect(() => {
    const overlay = document.getElementById('fadeOverlay')
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768
      const threshold = isMobile ? 22222 : 22222

      if (window.scrollY > threshold) {
        overlay?.classList.add(styles.visible)
      } else {
        overlay?.classList.remove(styles.visible)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const breakpoints = { default: 3, 768: 2, 480: 1 }
  const visibleMedia = shuffled.slice(0, visibleCount)

  return (
    <>
      <Head>
        <title>nathangiordano.com</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <section style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <EarthCanvas />
      </section>

      <section className={styles.copyBlock}>
        <div className={styles.copyContainer}>
          <div className={styles.copyText}>
            <h1>
              This is a catalog of work ranging from 2D, 3D, photography, animation, painting,
              drawing, and digital-physical hybrids. I create in multi-media. This is the age of the generalist.
            </h1>
            <p>
              The collection reshuffles itself every time you load the page. That
              interplay—the juxtaposition of elements, the unexpected pairings—is
              part of what keeps it interesting. The page only loads 100 items at
              a time, although the database has more than that.
            </p>
          </div>
          <div className={styles.copySocial}>
            <a href="https://www.instagram.com/nategiordano/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://x.com/nategio" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <main className={`${styles.grid} ${styles.container}`}>
        <Masonry
          breakpointCols={breakpoints}
          className={styles.masonry}
          columnClassName={styles.column}
        >
          {visibleMedia.map((src, idx) => {
  const fileName = decodeURIComponent(
    src.split('/').pop().split('.').slice(0, -1).join('.')
  )

  return (
    <div
      key={src}
      ref={el => (itemRefs.current[idx] = el)}
      className={styles.item}
    >
      <div className={styles.mediaWrapper}>
        {src.match(/\.(mp4|mov)$/i) ? (
          <video src={src} autoPlay muted loop playsInline preload="none" />
        ) : (
          <img src={src} alt={`media ${idx}`} loading="lazy" />
        )}
        <p className={styles.caption}>{fileName}</p>
      </div>
    </div>
  )
})}
        </Masonry>
      </main>

      <div id="fadeOverlay" className={`${styles.fadeOverlay}`}>
        <img
          src="/assets/fade-overlay.png"
          alt="Fade Overlay"
          className={styles.fadeImage}
        />
        <button
          className={styles.rerollButton}
          onClick={() => window.location.reload()}
        >
          Reroll
        </button>
      </div>
    </>
  )
}
