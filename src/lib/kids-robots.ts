// Kids Activities Robots.txt Configuration
// Ensures proper search engine crawling while protecting child privacy

export function generateKidsRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://latest-os.com';
  
  return `# Kids Activities Section - Child-Safe Crawling Rules

# General crawling rules
User-agent: *
Allow: /kids
Allow: /kids/activities
Allow: /kids/activities/*
Allow: /kids/help
Allow: /kids/safety
Allow: /kids/accessibility
Allow: /kids/parent-guide

# Block personal/private areas that could contain child data
Disallow: /kids/profile*
Disallow: /kids/progress*
Disallow: /api/kids/profile*
Disallow: /api/kids/progress*
Disallow: /kids/dashboard*
Disallow: /kids/settings*

# Block any URLs with query parameters that might contain child identifiers
Disallow: /kids/*?childId=*
Disallow: /kids/*?userId=*
Disallow: /kids/*?sessionId=*

# Allow static assets
Allow: /images/kids/*
Allow: /static/kids/*
Allow: /_next/static/*

# Special rules for major search engines
User-agent: Googlebot
Allow: /kids
Allow: /kids/activities
Allow: /kids/activities/*
Disallow: /kids/profile*
Disallow: /kids/progress*
Disallow: /api/kids/*
Crawl-delay: 1

User-agent: Bingbot
Allow: /kids
Allow: /kids/activities
Allow: /kids/activities/*
Disallow: /kids/profile*
Disallow: /kids/progress*
Disallow: /api/kids/*
Crawl-delay: 2

# More conservative crawling for other bots
User-agent: *
Crawl-delay: 5

# Sitemap location
Sitemap: ${baseUrl}/sitemap-kids.xml
Sitemap: ${baseUrl}/sitemap.xml

# Block access to sensitive file types
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.log$
Disallow: /*.env$

# Child safety: Block any URLs that might expose child data
Disallow: /kids/*/private
Disallow: /kids/*/personal
Disallow: /kids/*/data
Disallow: /kids/*/export
Disallow: /kids/*/download`;
}

// Content Security Policy for Kids section
export function generateKidsCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' blob:",
    "connect-src 'self' https://api.latest-os.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
}

// Security headers for Kids section
export function generateKidsSecurityHeaders(): Record<string, string> {
  return {
    // Content Security Policy
    'Content-Security-Policy': generateKidsCSP(),
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // XSS Protection
    'X-XSS-Protection': '1; mode=block',
    
    // Content type sniffing protection
    'X-Content-Type-Options': 'nosniff',
    
    // Referrer policy for privacy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy (restrict potentially harmful features)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'serial=()',
      'bluetooth=()'
    ].join(', '),
    
    // HSTS for secure connections
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Cache control for private content
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    
    // Prevent search engines from caching sensitive pages
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex'
  };
}

// Privacy-focused meta tags for child safety
export function generatePrivacyMetaTags(): Record<string, string> {
  return {
    // Prevent search engines from displaying sensitive information
    'robots': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
    
    // Child safety indicators
    'rating': 'general',
    'content-rating': 'safe for kids',
    'audience': 'children, parents, educators',
    
    // Privacy policy link
    'privacy-policy': 'https://latest-os.com/privacy',
    
    // Terms of service
    'terms-of-service': 'https://latest-os.com/terms',
    
    // Contact information for child safety concerns
    'child-safety-contact': 'safety@latest-os.com',
    
    // COPPA compliance indicator
    'coppa-compliant': 'true',
    
    // Data retention policy
    'data-retention': 'minimal, parent-controlled',
    
    // Geographic restrictions if any
    'geo-restrictions': 'none',
    
    // Language and localization
    'content-language': 'en',
    'locale': 'en_US'
  };
}

// URL patterns that should never be indexed
export const BLOCKED_PATTERNS = [
  '/kids/profile',
  '/kids/progress',
  '/kids/dashboard',
  '/kids/settings',
  '/api/kids/profile',
  '/api/kids/progress',
  '?childId=',
  '?userId=',
  '?sessionId=',
  '/kids/*/private',
  '/kids/*/personal',
  '/kids/*/data'
];

// Safe URL patterns that can be indexed
export const ALLOWED_PATTERNS = [
  '/kids',
  '/kids/activities',
  '/kids/activities/*',
  '/kids/help',
  '/kids/safety',
  '/kids/accessibility',
  '/kids/parent-guide'
];

export default {
  generateKidsRobotsTxt,
  generateKidsCSP,
  generateKidsSecurityHeaders,
  generatePrivacyMetaTags,
  BLOCKED_PATTERNS,
  ALLOWED_PATTERNS
};