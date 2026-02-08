import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import path from 'path'
import fs from 'fs'
import Masonry from 'react-masonry-css'
import Link from 'next/link'
import styles from '../styles/feed.module.css'
import Navbar from '../components/navbar'

export async function getStaticProps() {
  const dir = path.join(process.cwd(), 'public/sketches')
  const files = fs.readdirSync(dir)
  const media = files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .sort()
    .map(file => `/sketches/${file}`)

  return { props: { media } }
}

export default function Sketchbook({ media }) {
  const [visibleCount, setVisibleCount] = useState(12)
  const itemRefs = useRef([])
  const observerRef = useRef(null)

  useEffect(() => {
    document.body.classList.remove('reloading')
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.body.offsetHeight
      if (docHeight >= 10000) return
      if (scrollBottom >= docHeight - 1000) {
        setVisibleCount(prev => Math.min(prev + 12, media.length))
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [media.length])

  // Create a single persistent observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains(styles.visible)
        ) {
          entry.target.classList.add(styles.visible)
        }
      })
    }, { threshold: 0.1 })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Observe new items when visibleCount changes
  useEffect(() => {
    if (!observerRef.current) return

    const frameId = requestAnimationFrame(() => {
      itemRefs.current.forEach(ref => {
        if (ref && !ref.classList.contains(styles.visible)) {
          observerRef.current.observe(ref)
        }
      })
    })
    return () => cancelAnimationFrame(frameId)
  }, [visibleCount])

  useEffect(() => {
    setTimeout(() => {
      itemRefs.current.slice(0, visibleCount).forEach(ref => {
        if (ref && !ref.classList.contains(styles.visible)) {
          ref.classList.add(styles.visible)
        }
      })
    }, 50)
  }, [visibleCount])

  const breakpoints = { default: 4, 768: 2, 480: 1 }
  const visibleMedia = media.slice(0, visibleCount)

  return (
    <>
      <Head>
        <title>Sketchbook Collection</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
      </Head>
      <Navbar />
      <div className={styles.pageFade}></div>
      <div style={{ height: '80px' }}></div>
      <main className={styles.container} style={{ marginTop: '4rem' }}>
        <Masonry
          breakpointCols={breakpoints}
          className={`${styles.masonry} ${styles.masonryWithTopPadding}`}
          columnClassName={styles.column}
        >
          {visibleMedia.map((src, idx) => {
            const fileName = src.split('/').pop().split('.').slice(0, -1).join('.')
            return (
              <div
                key={src}
                ref={el => (itemRefs.current[idx] = el)}
                className={styles.item}
              >
                <div className={styles.mediaWrapper}>
                  {src.match(/\.(mp4|mov)$/i) ? (
                    <video src={src} autoPlay muted loop playsInline preload="none" />
                  ) : idx === 0 ? (
                    <Link href="/sketchbook/book-1" legacyBehavior>
                      <a>
                        <img src={src} alt={`Sketchbook ${idx}`} loading="lazy" />
                      </a>
                    </Link>
                  ) : (
                    <img src={src} alt={`Sketchbook ${idx}`} loading="lazy" />
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

