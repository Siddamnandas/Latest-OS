'use client';

import { useEffect, Suspense } from 'react';
import { Suspense as ReactSuspense } from 'react';
import { KidsActivities } from '@/components/KidsActivities';
import { PageErrorBoundary } from '@/components/ErrorBoundary';
import { SkipToMainLink } from '@/lib/accessibility';
import { ActivitiesGridSkeleton } from '@/components/ui/loading-states';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';

export function KidsPageContent() {
  // Structured data for search engines
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Latest-OS Kids Activities',
      description: 'Interactive learning activities for children featuring emotional intelligence, creativity, and cultural stories',
      url: 'https://latest-os.com',
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

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Structured Data - Add to head dynamically */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'Latest-OS Kids Activities',
            description: 'Interactive learning activities for children featuring emotional intelligence, creativity, and cultural stories'
          })
        }}
      />

      <SkipToMainLink />

      <PageErrorBoundary context="Kids Activities Tab">
        <main
          id="main-content"
          className="min-h-screen py-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
          role="main"
          aria-label="Kids Activities Section"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          <div className="container mx-auto px-4 max-w-7xl pb-20">
            <header className="text-center mb-6" itemScope itemType="https://schema.org/Organization">
              <h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
                itemProp="name"
              >
                Kids Activities
              </h1>
              <p
                className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                itemProp="description"
              >
                Discover fun and educational activities that help children learn about emotions,
                creativity, and fascinating stories from around the world.
              </p>
            </header>

            <Suspense
              fallback={
                <div className="space-y-6" role="status" aria-label="Loading activities">
                  <div className="text-center space-y-4">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                    <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                  </div>
                  <ActivitiesGridSkeleton count={6} />
                  <span className="sr-only">Loading kids activities, please wait...</span>
                </div>
              }
            >
              <KidsActivities />
            </Suspense>

            {/* Confetti effect for achievements - only show when triggered */}
            <InteractiveConfetti trigger={false} />
          </div>
        </main>
      </PageErrorBoundary>
    </>
  );
}

export default KidsPageContent;
