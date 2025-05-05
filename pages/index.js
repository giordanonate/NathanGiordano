import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import styles from '../feed.module.css';

function MediaItem({ src }) {
  const isVideo = src.match(/\.(mp4|mov)$/i);

  return (
    <div className={styles.item}>
      {isVideo ? (
        <video src={src} autoPlay muted loop playsInline />
      ) : (
        <img src={src} alt="" loading="lazy" />
      )}
    </div>
  );
}

export default function Home({ media }) {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.grid}>
        {media.map((src, index) => (
          <MediaItem key={index} src={src} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const dir = path.join(process.cwd(), 'public/nathan-giordano');
  const files = fs.readdirSync(dir);
  const media = files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .map(file => `/nathan-giordano/${file}`)
    .sort(() => 0.5 - Math.random()); // Shuffle order on each load

  return {
    props: {
      media,
    },
  };
}

