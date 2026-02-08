'use client'
import Head from 'next/head'

export default function IndexPage() {
  const handleEnter = () => {
    window.dispatchEvent(
      new CustomEvent('start-transition', { detail: '/home' })
    )
  }

  return (
    <>
      <Head>
        <title>nathangiordano.com</title>
      </Head>
      <div style={wrapperStyle} onClick={handleEnter}>
        <h1 style={enterStyle}>Enter</h1>
      </div>
    </>
  )
}

const wrapperStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  cursor: 'pointer',
}

const enterStyle = {
  fontSize: '2rem',
  fontFamily: 'Roboto Mono, monospace',
  userSelect: 'none',
  letterSpacing: '0.1em',
  margin: 0,
}
