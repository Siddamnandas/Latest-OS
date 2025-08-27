// Global Sitemap Generator
// Generates sitemap.xml for the entire application with focus on kids activities

import { MetadataRoute } from 'next';
import { generateKidsSitemap } from '@/lib/kids-seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://latest-os.com';
  
  // Main application pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Kids section pages
  const kidsPages = await generateKidsSitemap();

  // User/couple pages (excluding private areas)
  const userPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Don't include dashboard or private pages in sitemap
  ];

  // Help and documentation pages
  const helpPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help/getting-started`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  return [
    ...mainPages,
    ...kidsPages,
    ...userPages,
    ...helpPages,
  ];
}

// Dynamic sitemap for kids activities (if needed for large datasets)
export async function generateDynamicKidsSitemap(): Promise<MetadataRoute.Sitemap> {
  // This would be used if we have hundreds of activities
  // For now, the static approach above should be sufficient
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://latest-os.com';
  
  try {
    // In production, fetch from database
    // const activities = await prisma.activity.findMany({
    //   where: { isActive: true },
    //   select: { id: true, updatedAt: true, type: true }
    // });
    
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error generating dynamic kids sitemap:', error);
    return [];
  }
}