// Kids Activities SEO Middleware
// Automatically applies SEO optimizations and security headers for kids section

import { NextRequest, NextResponse } from 'next/server';
import { generateKidsSecurityHeaders, generatePrivacyMetaTags, BLOCKED_PATTERNS, ALLOWED_PATTERNS } from './kids-robots';

export function kidsMiddleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Check if this is a kids-related route
  if (!pathname.startsWith('/kids')) {
    return NextResponse.next();
  }

  // Block dangerous URL patterns for child safety
  const isDangerous = BLOCKED_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(pathname);
    }
    return pathname.includes(pattern) || request.url.includes(pattern);
  });

  if (isDangerous) {
    // Log security event
    console.warn(`Blocked potentially unsafe kids URL: ${pathname}`, {
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for'),
      timestamp: new Date().toISOString()
    });
    
    // Redirect to safe kids page
    return NextResponse.redirect(new URL('/kids', request.url), 301);
  }

  // Check for child identifiers in URLs (potential privacy violation)
  const hasChildId = searchParams.has('childId') || 
                     searchParams.has('userId') || 
                     searchParams.has('sessionId');

  if (hasChildId && !isAuthorizedRequest(request)) {
    console.warn(`Blocked unauthorized access to child data: ${pathname}`, {
      params: Object.fromEntries(searchParams.entries()),
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.redirect(new URL('/kids', request.url), 301);
  }

  // Create response with security headers
  const response = NextResponse.next();
  
  // Apply security headers for kids section
  const securityHeaders = generateKidsSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add privacy-focused headers for child safety
  const privacyHeaders = generatePrivacyMetaTags();
  Object.entries(privacyHeaders).forEach(([key, value]) => {
    response.headers.set(`X-Kids-${key}`, value);
  });

  // Add performance hints
  response.headers.set('Link', [
    '</images/kids-activities-og.png>; rel=preload; as=image',
    '<https://fonts.googleapis.com>; rel=dns-prefetch',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin'
  ].join(', '));

  // Add caching headers based on content type
  if (pathname.includes('/activities')) {
    // Cache activity pages for 1 hour
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  } else if (pathname === '/kids') {
    // Cache main kids page for 30 minutes
    response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
  } else if (pathname.includes('/profile') || pathname.includes('/progress')) {
    // Don't cache personal pages
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  }

  // Add CORS headers for API routes
  if (pathname.startsWith('/api/kids')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BASE_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

// Check if request is authorized to access child data
function isAuthorizedRequest(request: NextRequest): boolean {
  // Check for valid session/authentication
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('next-auth.session-token');
  
  // For now, allow if there's any authentication present
  // In production, implement proper parent-child authorization
  return !!(authHeader || sessionCookie);
}

// Rate limiting for kids section to prevent abuse
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function applyRateLimit(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max requests per window

  const current = rateLimitMap.get(ip);
  
  if (!current) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset if window has passed
  if (now - current.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Check if limit exceeded
  if (current.count >= maxRequests) {
    return false;
  }

  // Increment count
  current.count++;
  return true;
}

// Content filtering for child safety
export function filterContent(content: string): string {
  // List of words/phrases to filter out for child safety
  const blockedWords = [
    // Add appropriate content filters
    'inappropriate',
    'harmful',
    // This would be expanded based on content safety requirements
  ];

  let filteredContent = content;
  
  blockedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredContent = filteredContent.replace(regex, '[filtered]');
  });

  return filteredContent;
}

// Analytics tracking that respects child privacy
export function trackKidsPageView(pathname: string, metadata: {
  ageGroup?: string;
  activityType?: string;
  difficulty?: string;
}) {
  // Only track anonymized, aggregated data for kids section
  const anonymizedData = {
    page: pathname.replace(/\/kids\/[^\/]+\/[^\/]+/, '/kids/[category]/[item]'), // Anonymize specific items
    ageGroup: metadata.ageGroup,
    activityType: metadata.activityType,
    difficulty: metadata.difficulty,
    timestamp: new Date().toISOString(),
    // No personal identifiers, IP addresses, or session IDs
  };

  // Send to privacy-compliant analytics service
  if (typeof window !== 'undefined') {
    // Client-side analytics (respect do-not-track)
    if (!navigator.doNotTrack || navigator.doNotTrack === '0') {
      // Send anonymized data to analytics
      console.log('Kids page view (anonymized):', anonymizedData);
    }
  }
}

export default {
  kidsMiddleware,
  applyRateLimit,
  filterContent,
  trackKidsPageView
};