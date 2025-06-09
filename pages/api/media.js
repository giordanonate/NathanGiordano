export default async function handler(req, res) {
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY
  const FOLDER_ID = '1YD-G6_3ctUFeyXAy2RYnu4KZZiAo4rur'

  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)&pageSize=100`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error("Google API Error:", data)
      return res.status(500).json({ error: 'Google Drive API failed', details: data })
    }

    const media = data.files
      .filter(file =>
        file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')
      )
      .map(file => ({
        name: file.name,
        url: `https://drive.google.com/uc?export=view&id=${file.id}`
      }))

    res.status(200).json(media)
  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ error: 'Failed to fetch media from Google Drive' })
  }
}
