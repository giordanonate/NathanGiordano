import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import path from 'path';
import fs from 'fs';
import Masonry from 'react-masonry-css';
import styles from '../styles/feed.module.css';
import Navbar from '../components/navbar';

export async function getStaticProps() {
  const dir = path.join(process.cwd(), 'public/nathan-giordano');
  const files = fs.readdirSync(dir);
  const media = files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .map(file => `/nathan-giordano/${file}`)
    .sort(() => 0.5 - Math.random());

  return { props: { media } };
}

export default function Home({ media }) {
  const [visibleCount, setVisibleCount] = useState(24);
  const [showBadge, setShowBadge] = useState(false);
  const itemRefs = useRef([]);
  const fadeRef = useRef(null);

  // Scroll to top on load
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  // Lazy load media
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.body.offsetHeight;

      if (docHeight >= 12000) return; // ✅ New higher cap

      if (scrollBottom >= docHeight - 1000) {
        setVisibleCount(prev => Math.min(prev + 24, media.length)); // ✅ Load 24 at a time
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [media.length]);

  // Fade-in animation for grid items
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

  // Overlay scroll-based slide-up (final 700px)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const scrollBottom = scrollY + windowHeight;

      const startReveal = docHeight - windowHeight - 700;
      const endReveal = docHeight - windowHeight;

      if (!fadeRef.current) return;

      if (scrollBottom < startReveal) {
        fadeRef.current.style.transform = 'translateY(100%)';
      } else if (scrollBottom >= endReveal) {
        fadeRef.current.style.transform = 'translateY(0%)';
      } else {
        const progress = (scrollBottom - startReveal) / (endReveal - startReveal);
        const offset = 100 - progress * 100;
        fadeRef.current.style.transform = `translateY(${offset}%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show badge near bottom
  useEffect(() => {
    const trigger = document.getElementById('badgeTrigger');
    if (!trigger) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setShowBadge(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  const breakpoints = {
    default: 3,
    768: 2,
    480: 1,
  };

  const visibleMedia = media.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>Home – Nathan Giordano</title>
      </Head>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.gridWrapper}>
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
                  <img src={src} alt={`Item ${idx}`} loading="lazy" />
                )}
              </div>
            ))}
          </Masonry>

          {/* Badge */}
          <div
            id="nameBadge"
            className={`${styles.nameBadge} ${showBadge ? styles.visible : ''}`}
          >
            <button
              className={styles.rerollButton}
              onClick={() => window.location.reload()}
            >
              Reroll
            </button>
            Nathan Giordano
          </div>

          {/* Scroll-synced fade overlay */}
          <img
            ref={fadeRef}
            src="/assets/fade-overlay.png"
            alt="Fade Overlay"
            className={styles.fadeOverlay}
          />
        </div>

        <div id="badgeTrigger" className={styles.badgeTrigger} />
      </main>
    </>
  );
}
