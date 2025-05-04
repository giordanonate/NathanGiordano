import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import path from 'path';
import fs from 'fs';
import Masonry from 'react-masonry-css';
import styles from '../styles/feed.module.css';
import Navbar from '../components/navbar';

export async function getStaticProps() {
  const dir = path.join(process.cwd(), 'public/being');
  const files = fs.readdirSync(dir);
  const media = files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .map(file => `/being/${file}`)
    .sort(() => 0.5 - Math.random());

  return { props: { media } };
}

export default function Being({ media }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const itemRefs = useRef([]);

  // Scroll to top on load
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  // Lazy load media in batches until page reaches 10,000px
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.body.offsetHeight;

      if (docHeight >= 10000) return;

      if (scrollBottom >= docHeight - 1000) {
        setVisibleCount(prev => Math.min(prev + 12, media.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [media.length]);

  // Fade-in effect when items appear
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains(styles.visible)
          ) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleCount]);

  const breakpoints = {
    default: 3,
    768: 2,
    480: 1,
  };

  const visibleMedia = media.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>BEING Collection</title>
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
              {src.endsWith('.mp4') || src.endsWith('.mov') ? (
                <video src={src} autoPlay muted loop playsInline />
              ) : (
                <img src={src} alt={`BEING ${idx}`} loading="lazy" />
              )}
            </div>
          ))}
        </Masonry>
      </main>
    </>
  );
}
