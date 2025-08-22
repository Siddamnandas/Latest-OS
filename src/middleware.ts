import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // DEVELOPMENT MODE: Bypass all authentication
  // Comment out the lines below to re-enable authentication
  console.log('🚀 Development Mode: Authentication bypassed for:', pathname);
  return NextResponse.next();
  
  // Original authentication logic (commented out for development)
  /*
  // Allow access to auth pages, static files, and API auth routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }
  
  // Check for demo mode cookie
  const demoMode = request.cookies.get('demo-mode')?.value === 'true';
  
  if (demoMode) {
    return NextResponse.next();
  }
  
  // For all other routes, redirect to NextAuth signin
  const signInUrl = new URL('/api/auth/signin', request.url);
  signInUrl.searchParams.set('callbackUrl', request.url);
  return NextResponse.redirect(signInUrl);
  */
}

export const config = {
  matcher: ["/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)"],
};
