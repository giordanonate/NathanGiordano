export default function handler(req, res) {
  const { password } = JSON.parse(req.body)

  if (password === process.env.SB_PASSWORD) {
    res.setHeader(
  'Set-Cookie',
  'sb-auth=1; Path=/; SameSite=Lax; Max-Age=86400'
)
    return res.status(200).end()
  }

  res.status(401).end()
}