import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const mediaDir = path.join(process.cwd(), 'public/nathan-giordano')
  const files = fs.readdirSync(mediaDir)

  const media = files.map(file => ({
    name: file,
    url: `/nathan-giordano/${file}`
  }))

  res.status(200).json(media)
}
