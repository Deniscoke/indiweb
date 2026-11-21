import { NextResponse, type NextRequest } from 'next/server'
import { routeRequest } from '@/lib/proxy-route'

// Maps the public addresses (Czech unprefixed, /en and /de translated) onto the
// routes in app/[lang]. The language is never guessed from the browser.
export function proxy(request: NextRequest) {
  const decision = routeRequest(request.nextUrl.pathname)
  if (decision.action === 'next') return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = decision.pathname
  return decision.action === 'redirect' ? NextResponse.redirect(url, 308) : NextResponse.rewrite(url)
}

export const config = {
  // Everything except Next's own files, Vercel's (/_vercel/insights is where
  // visits are counted) and anything with a file extension (robots.txt,
  // sitemap.xml, icon.svg, images in public/).
  matcher: ['/((?!_next/|_vercel/|.*\\.[^/]*$).*)'],
}
