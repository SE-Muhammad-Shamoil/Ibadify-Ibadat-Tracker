import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we have an auth cookie (set by client side)
  const authCookie = request.cookies.get('firebaseAuth');
  const path = request.nextUrl.pathname;

  // Protected routes
  const isProtectedRoute = path.startsWith('/dashboard') || 
                           path.startsWith('/tracker') || 
                           path.startsWith('/review') || 
                           path.startsWith('/qaza') || 
                           path.startsWith('/history') || 
                           path.startsWith('/insights') || 
                           path.startsWith('/settings');

  if (isProtectedRoute && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = path === '/login' || path === '/signup';
  if (isAuthRoute && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tracker/:path*',
    '/review/:path*',
    '/qaza/:path*',
    '/history/:path*',
    '/insights/:path*',
    '/settings/:path*',
    '/login',
    '/signup'
  ],
};
