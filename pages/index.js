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
        <ImageSequence />
        <h1 style={enterStyle} className="enter-text" onClick={handleEnter}>Enter</h1>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .enter-text {
            margin-top: -7vh !important;
          }
        }
      `}</style>
    </>
  )
}

const wrapperStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
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
