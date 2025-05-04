import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import path from 'path';
import fs from 'fs';
import styles from '../styles/feed.module.css';
import Masonry from 'react-masonry-css';

export async function getStaticProps() {
  const root = path.join(process.cwd(), 'public');

  const getFiles = (folder) => {
    const dir = path.join(root, folder);
    const files = fs.readdirSync(dir);
    return files
      .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
      .map(file => `/${folder}/${file}`);
  };

  return {
    props: {
      feedData: {
        nathan: getFiles('nathan-giordano'),
        light: getFiles('light-work'),
        superbeing: getFiles('super-being'),
      },
    },
  };
}

export default function Feed({ feedData }) {
  const itemRefs = useRef([]);
  const [activeTab, setActiveTab] = useState('nathan');
  const [shuffledFeed, setShuffledFeed] = useState([]);

  const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

  useEffect(() => {
    const newItems = feedData[activeTab];
    const shuffled = shuffle(newItems);
    setShuffledFeed(shuffled);
    itemRefs.current = [];
  }, [activeTab]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) {
        ref.classList.remove(styles.visible);
        void ref.offsetWidth;
        observer.observe(ref);
      }
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [shuffledFeed]);

  useEffect(() => {
    const badge = document.getElementById('nameBadge');
    const trigger = document.getElementById('badgeTrigger');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (badge) {
          badge.classList.toggle(styles.visible, entry.isIntersecting);
        }
      },
      { threshold: 0.3 }
    );

    if (trigger) observer.observe(trigger);
    return () => trigger && observer.unobserve(trigger);
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    768: 2,
    480: 1,
  };

  return (
    <>
      <Head>
        <title>Feed – Nathan Giordano</title>
      </Head>

      <div
        className={`${styles.backdrop} ${activeTab === 'light' ? styles.backdropDark : ''}`}
      ></div>

      <div className={styles.scrollContainer}>
        <main className={styles.container}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${activeTab === 'nathan' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('nathan')}
            >
              Nathan Giordano
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'light' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('light')}
            >
              Light Work
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'superbeing' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('superbeing')}
            >
              SUPERBEING
            </button>
          </div>

          <div className={styles.gridWrapper}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.masonry}
              columnClassName={styles.column}
            >
              {shuffledFeed.map((src, idx) => (
                <div
                  key={src}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  className={styles.item}
                >
                  {src.endsWith('.mp4') ? (
                    <video src={src} autoPlay muted loop playsInline />
                  ) : (
                    <img src={src} alt={`Feed item ${idx}`} loading="lazy" />
                  )}
                </div>
              ))}
            </Masonry>

            <div
              id="nameBadge"
              className={`${styles.nameBadge} ${
                activeTab === 'light' ? styles.darkText : ''
              }`}
            >
              <button
                className={styles.rerollButton}
                onClick={() => window.location.reload()}
              >
                Reroll
              </button>
              {activeTab === 'nathan'
                ? 'Nathan Giordano'
                : activeTab === 'light'
                ? 'Light Work'
                : 'SUPERBEING'}
            </div>

            <img
              src={
                activeTab === 'light'
                  ? '/assets/fade-overlay-grey.png'
                  : '/assets/fade-overlay.png'
              }
              alt="Fade Overlay"
              className={styles.fadeOverlay}
            />
          </div>

          <div id="badgeTrigger" className={styles.badgeTrigger} />
        </main>
      </div>
    </>
  );
}
