import fs from 'fs'
import path from 'path'
import Head from 'next/head'
import Navbar from '../../components/navbar'
import styles from '../../styles/feed.module.css'
import { useRef, useState } from 'react'

export async function getStaticPaths() {
  const base = path.join(process.cwd(), 'public/sketches')
  const folders = fs.readdirSync(base).filter(name =>
    fs.statSync(path.join(base, name)).isDirectory()
  )
  const paths = folders.map(id => ({ params: { id } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const folderPath = path.join(process.cwd(), 'public/sketches', params.id)
  const files = fs.readdirSync(folderPath)
    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const pages = files.map(file => `/sketches/${params.id}/${file}`)
  return { props: { id: params.id, pages } }
}

export default function Sketchbook({ id, pages }) {
  const scrollRef = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const moved = useRef(false)
  const [grabbing, setGrabbing] = useState(false)

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return
    isDown.current = true
    moved.current = false
    setGrabbing(true)
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleMouseLeave = () => {
    isDown.current = false
    setGrabbing(false)
  }

  const handleMouseUp = (e) => {
    if (!scrollRef.current) return
    setGrabbing(false)

    if (!moved.current) {
      const container = scrollRef.current
      const clickX = e.clientX - container.getBoundingClientRect().left
      const scrollAmount = container.scrollWidth / pages.length

      if (clickX < container.clientWidth / 2) {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }

    isDown.current = false
  }

  const handleMouseMove = (e) => {
    if (!isDown.current || !scrollRef.current) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2 // lower sensitivity for smooth feel
    if (Math.abs(walk) > 5) moved.current = true
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <>
      <Head>
        <title>{id}</title>
      </Head>
      <Navbar />
      <div style={{ height: '80px' }}></div>

      <main className={styles.container}>
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            gap: '1rem',
            paddingBottom: '2rem',
            cursor: grabbing ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
          }}
        >
          {pages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Page ${i + 1}`}
              style={{
                height: '80vh',
                flex: '0 0 auto',
                objectFit: 'contain',
                borderRadius: '8px',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                pointerEvents: 'none',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
              }}
            />
          ))}
        </div>
      </main>
    </>
  )
}
