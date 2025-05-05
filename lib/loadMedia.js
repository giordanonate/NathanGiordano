// lib/loadMedia.js
import path from 'path';
import { promises as fs } from 'fs';

export async function loadMediaFromFirstAvailableFolder() {
  const baseDir = path.resolve('./public');
  const fallbackDirs = ['nathan-giordano', 'being', 'super-being'];

  for (const folder of fallbackDirs) {
    try {
      const dirPath = path.join(baseDir, folder);
      const files = await fs.readdir(dirPath);
      const media = files.filter(file =>
        file.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i)
      );
      if (media.length) {
        return media.map(file => `/${folder}/${file}`);
      }
    } catch (err) {
      // Folder might not exist — skip
    }
  }

  return [];
}
