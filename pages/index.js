'use client'
import Head from 'next/head'
import ImageSequence from '../components/ImageSequence'

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
      <div style={wrapperStyle}>
        <div style={groupStyle}>
          <ImageSequence />
          <h1 style={enterStyle} onClick={handleEnter}>Enter</h1>
        </div>
      </div>
    </>
  )
}

const wrapperStyle = {
  width: '100vw',
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
}

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
}

const enterStyle = {
  fontSize: '2rem',
  fontFamily: 'Roboto Mono, monospace',
  userSelect: 'none',
  letterSpacing: '0.1em',
  margin: 0,
  cursor: 'pointer',
}
