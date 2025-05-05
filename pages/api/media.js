// pages/api/media.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const baseDir = path.resolve('./public');
  const fallbackDirs = ['nathan-giordano', 'being', 'super-being'];

  for (const folder of fallbackDirs) {
    const dirPath = path.join(baseDir, folder);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      const media = files.filter(file =>
        file.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i)
      );
      if (media.length) {
        const shuffled = media
          .sort(() => 0.5 - Math.random())
          .map(file => `/${folder}/${file}`);
        res.status(200).json(shuffled);
        return;
      }
    }
  }

  res.status(200).json([]);
}
