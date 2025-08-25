import { Metadata } from 'next';
import { Suspense } from 'react';
import { KidsActivities } from '@/components/KidsActivities';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export const metadata: Metadata = {
  title: 'Kids Activities | Latest-OS',
  description: 'Interactive learning activities for children featuring emotional intelligence, creativity, and cultural stories',
  keywords: 'kids activities, children learning, emotional intelligence, creativity, mythology, education',
  openGraph: {
    title: 'Kids Activities - Interactive Learning for Children',
    description: 'Engaging activities that help children learn about emotions, creativity, and cultural stories',
    type: 'website',
    images: [
      {
        url: '/images/kids-activities-og.png',
        width: 1200,
        height: 630,
        alt: 'Kids Activities Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kids Activities - Interactive Learning',
    description: 'Fun and educational activities for children'
  }
};

export default function KidsPage() {
  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
      role="main"
      aria-label="Kids Activities Page"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Kids Activities
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover fun and educational activities that help children learn about emotions, 
            creativity, and fascinating stories from around the world.
          </p>
        </header>

        <ErrorBoundary
          fallback={
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're having trouble loading the activities. Please try refreshing the page.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          }
        >
          <Suspense fallback={<LoadingSkeleton />}>
            <KidsActivities />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}