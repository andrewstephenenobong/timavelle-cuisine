import type { MetadataRoute } from 'next';

const baseUrl = 'https://timavelle-cuisine.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/menu', '/gallery', '/services', '/faqs', '/contact'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
