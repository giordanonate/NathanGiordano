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
        <h1>
          This is a catalog of work ranging from 2D, 3D, photography, animation, painting,
          drawing, and digital-physical hybrids. I create in multi-media.
        </h1>
        <p>
          The collection reshuffles itself every time you load the page. That
          interplay—the juxtaposition of elements, the unexpected pairings—is
          part of what keeps it interesting. The page only loads 100 items at 
          a time, although the database has more than that.
        </p>
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
