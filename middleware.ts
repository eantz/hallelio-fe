import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/dashboard']
const authRoutes = ['/register','/']

export function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)

  const hasToken = req.cookies.has('token')

  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()

}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}