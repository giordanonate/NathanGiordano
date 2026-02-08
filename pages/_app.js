import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import TransitionOverlay from '../components/TransitionOverlay.js'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Lock body only on root path
      if (url === '/') {
        document.body.classList.add('locked')
      } else {
        document.body.classList.remove('locked')
      }

      // Scroll to top after route change completes
      window.scrollTo(0, 0)
    }

    // Handle initial load
    handleRouteChange(router.pathname)

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </Head>
      <TransitionOverlay />
      <div className="pageWrapper">
        <Component {...pageProps} />
      </div>
    </>
  )
}
