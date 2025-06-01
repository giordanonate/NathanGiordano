import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === '/') {
        document.body.classList.add('locked');
      } else {
        document.body.classList.remove('locked');
      }
    };

    // Check on initial load
    handleRouteChange(router.pathname);

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <div className="pageWrapper">
      <Component {...pageProps} />
    </div>
  );
}
