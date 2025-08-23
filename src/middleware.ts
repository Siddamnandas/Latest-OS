import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60;
const requests = new Map<string, { count: number; start: number }>();

function rateLimit(req: NextRequest): NextResponse | null {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const entry = requests.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_LIMIT_WINDOW) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count += 1;
  requests.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const limited = rateLimit(request);
    if (limited) return limited;
  }
  
  // DEVELOPMENT MODE: Bypass authentication for most routes except admin
  if (pathname.startsWith('/admin')) {
    // Protect admin routes - redirect to login if no session
    logger.info('🔒 Admin route - checking authentication for:', pathname);
    // For demo, we'll redirect to login for admin routes
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  logger.info('🚀 Development Mode: Authentication bypassed for:', pathname);
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
