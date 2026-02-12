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

  return {
    props: { media },
    revalidate: 60 // Regenerate page every minute
  }
}


export default function Home({ media }) {
  const [visibleCount, setVisibleCount] = useState(12)
  const [shuffled, setShuffled] = useState([])
  const itemRefs = useRef([])

  useEffect(() => {
    setShuffled([...media].sort(() => 0.5 - Math.random()))
  }, [media])

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.body.offsetHeight
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

  const breakpoints = { default: 3, 768: 2, 480: 1 }
  const visibleMedia = shuffled.slice(0, visibleCount)

  return (
    <>
      <Head>
        <title>nathangiordano.com</title>
      </Head>

      <Navbar />

      <section style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <EarthCanvas />
      </section>

      <section className={styles.copySection}>
        <div className={styles.copyBlock}>
          <h1>
            This is a catalog of work ranging from 2D, 3D, photography, animation, painting,
            drawing, and digital-physical hybrids. I create in multi-media.
          </h1>
          <p>
            The collection reshuffles itself every time you load the page. That
            interplay—the juxtaposition of elements, the unexpected pairings—is
            part of what keeps it interesting.
          </p>
        </div>
        <div className={styles.socialIcons}>
          <a href="https://instagram.com/nategiordano" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://twitter.com/nategio" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
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
    </>
  )
}
