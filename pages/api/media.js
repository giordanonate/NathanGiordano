import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const mediaDir = path.join(process.cwd(), 'public/nathan-giordano')
  const allFiles = fs.readdirSync(mediaDir)
    .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|cr2)$/i))

  // Shuffle and limit to 100
  const shuffled = allFiles.sort(() => 0.5 - Math.random()).slice(0, 100)

  const media = shuffled.map(file => ({
    name: file,
    url: `/nathan-giordano/${file}`
  }))

  res.status(200).json(media)
}
