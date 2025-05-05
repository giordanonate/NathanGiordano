import fs from 'fs';
import path from 'path';
import { useEffect } from 'react';

export default function Home({ media }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <div className="grid">
        {media.map((file, index) => {
          const isVideo = file.endsWith('.mp4') || file.endsWith('.mov');
          return isVideo ? (
            <video key={index} src={file} autoPlay muted loop playsInline />
          ) : (
            <img key={index} src={file} alt={`media-${index}`} />
          );
        })}
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  const dir = path.join(process.cwd(), 'public/nathan-giordano');
  const files = fs.readdirSync(dir);
  const media = files
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .map(file => `/nathan-giordano/${file}`)
    .sort(() => 0.5 - Math.random());

  return {
    props: {
      media,
    },
  };
}
