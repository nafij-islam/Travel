import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Manrope, Inter, Noto_Sans_Bengali } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/common/SmoothScroll';
import { BackToTop } from '@/components/common/BackToTop';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'Ghurabo — Real Trip Costs & Travel Experiences in Bangladesh',
    template: '%s | Ghurabo',
  },
  description: SITE_CONFIG.description.en,
  keywords: SITE_CONFIG.keywords.en,
  authors: [{ name: 'Ghurabo Community' }],
  creator: 'Ghurabo Technologies Ltd.',
  publisher: 'Ghurabo Technologies Ltd.',
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
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.domain,
    siteName: 'Ghurabo',
    title: 'Ghurabo — Real Trip Costs & Travel Experiences in Bangladesh',
    description: SITE_CONFIG.description.en,
    images: [
      {
        url: `${SITE_CONFIG.domain}/images/sajek_cloud_valley.png`,
        width: 1200,
        height: 630,
        alt: 'Ghurabo — Real Trips. Real Costs. Real Experiences.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghurabo — Real Trip Costs & Travel Experiences in Bangladesh',
    description: SITE_CONFIG.description.en,
    images: [`${SITE_CONFIG.domain}/images/sajek_cloud_valley.png`],
  },
  verification: {
    google: 'google-site-verification-ghurabo-placeholder',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${notoSansBengali.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ghurabo_theme') || 'system';
                  var isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-purple selection:text-white transition-colors duration-150">
        <ThemeProvider>
          <LanguageProvider>
            <Suspense fallback={null}>
              <SmoothScroll>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileNav />
                <BackToTop />
              </SmoothScroll>
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
