import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Masonry from 'react-masonry-css';
import styles from '../styles/feed.module.css';
import Navbar from '../components/navbar';
import { loadMediaFromFirstAvailableFolder } from '../lib/loadMedia';

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  const media = loadMediaFromFirstAvailableFolder();

  return {
    props: {
      media: media.sort(() => 0.5 - Math.random()),
    },
  };
}

export default function Home({ media }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [shuffled, setShuffled] = useState([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    setShuffled([...media].sort(() => 0.5 - Math.random()));
  }, [media]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.body.offsetHeight;
      if (docHeight >= 10000) return;
      if (scrollBottom >= docHeight - 1000) {
        setVisibleCount(prev => Math.min(prev + 12, shuffled.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shuffled.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains(styles.visible)
        ) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    itemRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => itemRefs.current.forEach(ref => ref && observer.unobserve(ref));
  }, [visibleCount]);

  useEffect(() => {
    setTimeout(() => {
      itemRefs.current.slice(0, visibleCount).forEach(ref => {
        if (ref && !ref.classList.contains(styles.visible)) {
          ref.classList.add(styles.visible);
        }
      });
    }, 50);
  }, [shuffled]);

  const breakpoints = { default: 3, 768: 2, 480: 1 };
  const visibleMedia = shuffled.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>nathangiordano.com</title>
      </Head>
      <Navbar />
      <main className={styles.container}>
        <Masonry
          breakpointCols={breakpoints}
          className={styles.masonry}
          columnClassName={styles.column}
        >
          {visibleMedia.map((src, idx) => (
            <div
              key={src}
              ref={el => (itemRefs.current[idx] = el)}
              className={styles.item}
            >
              {src.match(/\.(mp4|webm|mov)$/i) ? (
                <video src={src} autoPlay muted loop playsInline />
              ) : (
                <img src={src} alt={`media ${idx}`} loading="lazy" />
              )}
            </div>
          ))}
        </Masonry>
      </main>
    </>
  );
}
