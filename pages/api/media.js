// pages/api/media.js
export default async function handler(req, res) {
  const { loadMediaFromFirstAvailableFolder } = await import('../../lib/loadMedia.js');
  const media = await loadMediaFromFirstAvailableFolder(); // ← await required
  const shuffled = media.sort(() => 0.5 - Math.random());
  res.status(200).json(shuffled);
}
