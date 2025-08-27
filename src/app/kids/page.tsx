import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { KidsActivities } from '@/components/KidsActivities';
import { PageErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoading, ActivitiesGridSkeleton } from '@/components/ui/loading-states';
import { AccessibilityProvider, SkipToMainLink } from '@/lib/accessibility';
import '@/styles/accessibility.css';

export const metadata: Metadata = {
  title: {
    default: 'Kids Activities | Latest-OS',
    template: '%s | Kids Activities | Latest-OS'
  },
  description: 'Interactive learning activities for children featuring emotional intelligence, creativity, mythology, and cultural stories. Safe, educational, and designed for ages 3-12.',
  keywords: [
    'kids activities',
    'children learning',
    'emotional intelligence',
    'creativity for kids',
    'mythology for children',
    'education',
    'accessible learning',
    'inclusive design',
    'safe learning environment',
    'parent-supervised activities',
    'cultural education',
    'child development',
    'interactive learning'
  ].join(', '),
  authors: [{ name: 'Latest-OS Team' }],
  creator: 'Latest-OS',
  publisher: 'Latest-OS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Kids Activities - Interactive Learning for Children',
    description: 'Safe, engaging activities that help children learn about emotions, creativity, and cultural stories. Parent-supervised learning for ages 3-12.',
    type: 'website',
    url: 'https://latest-os.com/kids',
    siteName: 'Latest-OS',
    locale: 'en_US',
    images: [
      {
        url: '/images/kids-activities-og.png',
        width: 1200,
        height: 630,
        alt: 'Kids Activities - Interactive learning platform with colorful, child-friendly interface',
        type: 'image/png'
      },
      {
        url: '/images/kids-activities-square.png',
        width: 400,
        height: 400,
        alt: 'Kids Activities Logo',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LatestOS',
    creator: '@LatestOS',
    title: 'Kids Activities - Interactive Learning',
    description: 'Safe, fun, and educational activities for children ages 3-12. Parent-supervised learning environment.',
    images: ['/images/kids-activities-twitter.png']
  },

  category: 'education',
  classification: 'Educational Content for Children',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    // Child safety and content rating
    'rating': 'general',
    'content-rating': 'safe for kids',
    'audience': 'children, parents, educators',
    // Accessibility features
    'accessibility-features': 'keyboard-navigation, screen-reader-friendly, high-contrast-support',
    // Language and localization
    'content-language': 'en',
    'geo.region': 'US',
    // Performance hints
    'dns-prefetch': 'https://fonts.googleapis.com',
    'preconnect': 'https://fonts.gstatic.com'
  },
  alternates: {
    canonical: 'https://latest-os.com/kids',
    languages: {
      'en-US': 'https://latest-os.com/kids',
      'es-ES': 'https://latest-os.com/es/kids',
      'fr-FR': 'https://latest-os.com/fr/kids'
    }
  },
  verification: {
    google: 'google-site-verification-code-here',
    yandex: 'yandex-verification-code-here',
    yahoo: 'yahoo-verification-code-here'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  colorScheme: 'light dark',
};

export default function KidsPage() {
  // Structured data for search engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Latest-OS Kids Activities',
    description: 'Interactive learning activities for children featuring emotional intelligence, creativity, and cultural stories',
    url: 'https://latest-os.com/kids',
    logo: 'https://latest-os.com/images/logo.png',
    sameAs: [
      'https://twitter.com/LatestOS',
      'https://github.com/latest-os'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@latest-os.com'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Kids Educational Activities',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Emotional Intelligence Activities',
            description: 'Activities to help children understand and manage emotions',
            educationalLevel: 'Preschool, Elementary',
            audience: {
              '@type': 'EducationalAudience',
              audienceType: 'Children',
              educationalRole: 'Student'
            },
            teaches: 'Emotional Intelligence, Self-awareness, Empathy'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Creative Expression Activities',
            description: 'Art, music, and creative activities for children',
            educationalLevel: 'Preschool, Elementary',
            audience: {
              '@type': 'EducationalAudience',
              audienceType: 'Children',
              educationalRole: 'Student'
            },
            teaches: 'Creativity, Artistic Expression, Imagination'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Cultural Stories and Mythology',
            description: 'Educational stories and mythology from various cultures',
            educationalLevel: 'Elementary',
            audience: {
              '@type': 'EducationalAudience',
              audienceType: 'Children',
              educationalRole: 'Student'
            },
            teaches: 'Cultural Awareness, History, Storytelling'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Parent Reviewer'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        reviewBody: 'Excellent educational platform for children with great accessibility features.'
      }
    ]
  };

  return (
    <AccessibilityProvider>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SkipToMainLink />
      <PageErrorBoundary context="Kids Activities Page">
        <main 
          id="main-content"
          className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
          role="main"
          aria-label="Kids Activities Page"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="text-center mb-8" itemScope itemType="https://schema.org/Organization">
              <h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                itemProp="name"
              >
                Kids Activities
              </h1>
              <p 
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                itemProp="description"
              >
                Discover fun and educational activities that help children learn about emotions, 
                creativity, and fascinating stories from around the world.
              </p>
            </header>

            <Suspense 
              fallback={
                <div className="space-y-8" role="status" aria-label="Loading activities">
                  <div className="text-center space-y-4">
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                    <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                  </div>
                  <ActivitiesGridSkeleton count={6} />
                  <span className="sr-only">Loading kids activities, please wait...</span>
                </div>
              }
            >
              <KidsActivities />
            </Suspense>
          </div>
        </main>
      </PageErrorBoundary>
    </AccessibilityProvider>
  );
}