// Kids Activities Sitemap Configuration
// Dynamically generates sitemap entries for kids activities and related pages

import { MetadataRoute } from 'next';

export async function generateKidsSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://latest-os.com';
  
  // Base kids pages
  const staticPages = [
    {
      url: `${baseUrl}/kids`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kids/activities`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kids/progress`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kids/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ];

  // Activity categories
  const activityCategories = [
    'emotion',
    'creativity', 
    'mythology',
    'kindness',
    'story',
    'music',
    'movement'
  ];

  const categoryPages = activityCategories.map(category => ({
    url: `${baseUrl}/kids/activities/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Difficulty levels
  const difficultyLevels = ['easy', 'medium', 'hard'];
  const difficultyPages = difficultyLevels.map(level => ({
    url: `${baseUrl}/kids/activities/difficulty/${level}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Age groups
  const ageGroups = [
    { slug: 'toddler', range: '3-4' },
    { slug: 'preschool', range: '4-6' },
    { slug: 'elementary', range: '6-12' },
    { slug: 'preteen', range: '12-14' }
  ];

  const ageGroupPages = ageGroups.map(group => ({
    url: `${baseUrl}/kids/activities/age/${group.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Help and documentation pages
  const helpPages = [
    {
      url: `${baseUrl}/kids/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/kids/safety`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7, // High priority for safety information
    },
    {
      url: `${baseUrl}/kids/accessibility`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kids/parent-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ];

  return [
    ...staticPages,
    ...categoryPages,
    ...difficultyPages,
    ...ageGroupPages,
    ...helpPages
  ];
}

// SEO utility functions
export function generateKidsMetaTags(options: {
  title?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  ageGroup?: string;
  keywords?: string[];
}) {
  const {
    title = 'Kids Activities',
    description = 'Interactive learning activities for children',
    category,
    difficulty,
    ageGroup,
    keywords = []
  } = options;

  const baseKeywords = [
    'kids activities',
    'children learning',
    'educational games',
    'interactive learning',
    'child development',
    'safe learning environment'
  ];

  // Add contextual keywords
  if (category) {
    baseKeywords.push(`${category} activities for kids`);
  }
  if (difficulty) {
    baseKeywords.push(`${difficulty} activities for children`);
  }
  if (ageGroup) {
    baseKeywords.push(`activities for ${ageGroup}`);
  }

  const allKeywords = [...baseKeywords, ...keywords];

  return {
    title: `${title} | Kids Activities | Latest-OS`,
    description,
    keywords: allKeywords.join(', '),
    openGraph: {
      title: `${title} - Kids Activities`,
      description,
      type: 'website',
      images: [
        {
          url: '/images/kids-activities-og.png',
          width: 1200,
          height: 630,
          alt: `${title} - Kids Activities Preview`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Kids Activities`,
      description
    }
  };
}

// Structured data generators
export function generateActivityStructuredData(activity: {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  ageMin: number;
  ageMax: number;
  estimatedDuration: number;
  learningObjectives: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `https://latest-os.com/kids/activities/${activity.id}`,
    name: activity.title,
    description: activity.description,
    url: `https://latest-os.com/kids/activities/${activity.id}`,
    educationalLevel: activity.ageMin <= 6 ? 'Preschool' : 'Elementary',
    audience: {
      '@type': 'EducationalAudience',
      audienceType: 'Children',
      educationalRole: 'Student'
    },
    interactivityType: 'active',
    learningResourceType: 'Activity',
    teaches: activity.learningObjectives,
    timeRequired: `PT${activity.estimatedDuration}M`,
    typicalAgeRange: `${activity.ageMin}-${activity.ageMax}`,
    accessibilityFeature: [
      'keyboard-navigation',
      'screen-reader-friendly',
      'high-contrast-display',
      'text-to-speech'
    ],
    accessibilityHazard: 'none',
    accessMode: ['textual', 'visual'],
    accessModeSufficient: ['textual', 'visual'],
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'Latest-OS',
      url: 'https://latest-os.com'
    },
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    inLanguage: 'en-US'
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

// SEO optimization utilities
export function optimizeImageForSEO(imageSrc: string, alt: string, title: string) {
  return {
    src: imageSrc,
    alt,
    title,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  };
}

export function generateCanonicalUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://latest-os.com';
  return `${baseUrl}${path}`;
}

export default {
  generateKidsSitemap,
  generateKidsMetaTags,
  generateActivityStructuredData,
  generateBreadcrumbStructuredData,
  optimizeImageForSEO,
  generateCanonicalUrl
};