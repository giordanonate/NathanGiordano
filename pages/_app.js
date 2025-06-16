import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TransitionOverlay from '@/components/TransitionOverlay';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Lock body only on root path
      if (url === '/') {
        document.body.classList.add('locked');
      } else {
        document.body.classList.remove('locked');
      }

      // Scroll to top after route change completes
      window.scrollTo(0, 0);
    };

    // Handle initial load
    handleRouteChange(router.pathname);

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <TransitionOverlay />
      <div className="pageWrapper">
        <Component {...pageProps} />
      </div>
    </>
  );
}
