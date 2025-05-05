import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import path from 'path';
import fs from 'fs';
import Masonry from 'react-masonry-css';
import styles from '../styles/feed.module.css';
import Navbar from '../components/navbar';

export async function getStaticProps() {
  const dir = path.join(process.cwd(), 'public/super-being');
  const files = fs.readdirSync(dir);
  const media = files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .map(file => `/super-being/${file}`);

  return { props: { media } };
}

export default function Superbeing({ media }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [shuffled, setShuffled] = useState([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    document.body.classList.remove('reloading');
  }, []);

  useEffect(() => {
    setShuffled([...media].sort(() => 0.5 - Math.random()));
  }, [media]);

  useEffect(() => {
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
      <Head><title>SuperBEING Collection</title></Head>
      <Navbar />
      <div className={styles.pageFade}></div>
      <div style={{ height: '80px' }}></div>
      <main className={styles.container}>
        <Masonry
          breakpointCols={breakpoints}
          className={
