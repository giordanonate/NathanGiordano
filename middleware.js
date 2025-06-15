import { NextResponse } from 'next/server'

export function middleware(req) {
  const cookie = req.cookies.get('sb-auth')
  const url = req.nextUrl.clone()

  // ✅ Block access to /superbeing unless sb-auth=1
  if (url.pathname === '/superbeing' && cookie?.value !== '1') {
    url.searchParams.set('unauthorized', '1')
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
