export default async function handler(req, res) {
  const FOLDER_ID = '1YD-G6_3ctUFeyXAy2RYnu4KZZiAo4rur'
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY

  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false+and+(mimeType contains 'image/' or mimeType contains 'video/')&key=${API_KEY}&fields=files(id,name,mimeType)&pageSize=200`

  try {
    const response = await fetch(url)
    const data = await response.json()

    const files = data.files || []

    const formatted = files.map(file => ({
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`
    }))

    res.status(200).json(formatted)
  } catch (error) {
    console.error('Google Drive API failed', error)
    res.status(500).json({ error: 'Failed to fetch media from Google Drive' })
  }
}
