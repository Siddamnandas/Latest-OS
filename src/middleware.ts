import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // In production, enforce authentication (no global bypass)
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const ua = request.headers.get('user-agent') || '';
    const isMobileAppUA = ua.includes('LatestOS-Mobile');
    // Allow access to auth pages, static files, images and API auth routes
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/health') ||
      pathname.includes('/favicon.ico') ||
      pathname.startsWith('/icons') ||
      pathname.startsWith('/manifest.json') ||
      pathname.startsWith('/robots.txt') ||
      pathname.startsWith('/mobile-only')
    ) {
      return NextResponse.next();
    }

    // Redirect admin routes to login if not authenticated
    if (pathname.startsWith('/admin')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Block non-API UI routes unless coming from the mobile app WebView
    if (!pathname.startsWith('/api/') && !isMobileAppUA) {
      const url = new URL('/mobile-only', request.url);
      return NextResponse.redirect(url, 302);
    }

    return NextResponse.next();
  }

  // Development mode: keep existing bypass for faster iteration
  if (pathname.startsWith('/admin')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)"],
};
