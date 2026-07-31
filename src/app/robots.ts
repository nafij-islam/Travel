import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/trips/create',
          '/trips/*/edit',
          '/api/*',
          '/auth/*',
          '/*?*sort=*',
          '/*?*view=*',
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  };
}
