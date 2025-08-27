import { NextResponse } from 'next/server';
import { generateKidsRobotsTxt } from '../../lib/kids-robots';

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://latest-os.com';
  
  const robotsTxt = `
# Latest-OS Robots.txt
# Updated: ${new Date().toISOString()}

# General crawling rules
User-agent: *
Allow: /
Allow: /about
Allow: /contact
Allow: /help
Allow: /help/*
Allow: /auth/signin
Allow: /auth/signup

# Block private/user areas
Disallow: /dashboard*
Disallow: /profile*
Disallow: /settings*
Disallow: /api/private*
Disallow: /api/user*
Disallow: /api/auth*

# Allow public API documentation
Allow: /api/docs
Allow: /api/public*

# Block admin areas
Disallow: /admin*
Disallow: /api/admin*

# Block temporary/development paths
Disallow: /dev*
Disallow: /test*
Disallow: /staging*

${generateKidsRobotsTxt()}

# Performance optimizations
Crawl-delay: 1

# Special rules for major search engines
User-agent: Googlebot
Crawl-delay: 1
Allow: /
Disallow: /dashboard*
Disallow: /profile*
Disallow: /api/private*

User-agent: Bingbot
Crawl-delay: 2
Allow: /
Disallow: /dashboard*
Disallow: /profile*

User-agent: Slurp
Crawl-delay: 3
Allow: /
Disallow: /dashboard*
Disallow: /profile*

# Block aggressive crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Allow social media crawlers for Open Graph
User-agent: facebookexternalhit
Allow: /
Allow: /kids
Allow: /kids/activities

User-agent: Twitterbot
Allow: /
Allow: /kids
Allow: /kids/activities

User-agent: LinkedInBot
Allow: /
Allow: /kids
Allow: /kids/activities

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-kids.xml

# Block sensitive file types
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.log$
Disallow: /*.env$
Disallow: /*.config$
Disallow: /*.yml$
Disallow: /*.yaml$

# Allow static assets
Allow: /images/
Allow: /icons/
Allow: /static/
Allow: /_next/static/
Allow: /favicon.ico
Allow: /manifest.json
`.trim();

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600' // Cache for 1 hour
    }
  });
}