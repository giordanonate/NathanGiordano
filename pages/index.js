'use client'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const handleEnter = () => {
    window.dispatchEvent(
      new CustomEvent('start-transition', { detail: '/home' })
    )
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        cursor: 'pointer',
      }}
      onClick={handleEnter}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontFamily: 'Roboto Mono, monospace',
          userSelect: 'none',
        }}
      >
        Enter
      </h1>
    </div>
  )
}
