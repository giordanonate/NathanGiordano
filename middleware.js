import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()
  const cookie = req.cookies.get('sb-auth')

  if (url.pathname === '/superbeing' && cookie?.value !== process.env.NEXT_PUBLIC_SB_PASSWORD) {
    url.searchParams.set('unauthorized', '1')
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
