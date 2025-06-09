import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const mediaDir = path.join(process.cwd(), 'public/nathan-giordano')

    // Read only filenames, don't preload anything
    const allFiles = fs.readdirSync(mediaDir).filter(file =>
      file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|cr2)$/i)
    )

    // Shuffle & take just 100
    const selected = allFiles
      .sort(() => 0.5 - Math.random())
      .slice(0, 100)
      .map(file => ({
        name: file,
        url: `/nathan-giordano/${file}`
      }))

    res.status(200).json(selected)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to read media directory' })
  }
}
