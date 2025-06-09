export default function handler(req, res) {
  const { password } = JSON.parse(req.body)

  if (password === process.env.NEXT_PUBLIC_SB_PASSWORD) {
    res.setHeader('Set-Cookie', `sb-auth=${password}; Path=/;`)
    return res.status(200).end()
  }

  res.status(401).end()
}
