import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/dashboard']

export function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  const hasToken = req.cookies.has('token')

  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()

}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}