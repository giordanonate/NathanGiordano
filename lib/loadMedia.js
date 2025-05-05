// lib/loadMedia.js
import fs from 'fs';
import path from 'path';

export function loadMediaFromFirstAvailableFolder() {
  const baseDir = path.resolve('./public');
  const fallbackDirs = ['nathan-giordano', 'being', 'super-being'];

  for (const folder of fallbackDirs) {
    const dirPath = path.join(baseDir, folder);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      const filtered = files.filter(file =>
        file.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i)
      );
      if (filtered.length) {
        return filtered.map(file => `/${folder}/${file}`);
      }
    }
  }

  return [];
}
