import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nextAuthMiddleware from 'next-auth/middleware';

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

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const limited = rateLimit(req);
    if (limited) return limited;
  }
  return nextAuthMiddleware(req);
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
