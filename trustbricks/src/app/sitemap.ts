import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trustbrickspropertieslimited.com.ng';

  const pages = [
    { url: '', priority: 1, changeFrequency: 'daily' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/how-it-works', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/mortgage-advisory', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/pencom-guidelines', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/careers', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/press', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/insights', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
