import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const cookie = req.cookies['sb-auth']

  if (cookie !== '1') {
    return res.status(401).end('Unauthorized')
  }

  const filename = req.query.file
  if (!filename || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).end('Invalid filename')
  }

  const filePath = path.join(process.cwd(), 'private/super-being', filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).end('Not found')
  }

  const ext = path.extname(filename).toLowerCase()
  const contentTypeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
  }

  const contentType = contentTypeMap[ext] || 'application/octet-stream'
  res.setHeader('Content-Type', contentType)

  const stream = fs.createReadStream(filePath)
  stream.pipe(res)
}
