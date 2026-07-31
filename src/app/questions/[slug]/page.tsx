import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { generateQAPageSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { QuestionDetailClient } from '@/components/questions/QuestionDetailClient';
import { MOCK_QUESTIONS } from '@/lib/data/mockData';

interface QuestionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const question = MOCK_QUESTIONS.find((q) => q.slug === params.slug) || MOCK_QUESTIONS[0];
  if (!question) {
    return { title: 'Question Not Found | Ghurabo' };
  }

  const title = `${question.title} | Ghurabo Travel Community`;
  const description = question.details;
  const url = `${SITE_CONFIG.domain}/questions/${question.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${url}?lang=en`,
        bn: `${url}?lang=bn`,
        'x-default': url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
    },
  };
}

export function generateStaticParams() {
  return MOCK_QUESTIONS.map((q) => ({ slug: q.slug }));
}

export default function QuestionDetailPage({ params }: QuestionPageProps) {
  const question = MOCK_QUESTIONS.find((q) => q.slug === params.slug) || MOCK_QUESTIONS[0];
  if (!question) notFound();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Questions', url: '/questions' },
    { name: question.title, url: `/questions/${question.slug}` },
  ];

  return (
    <>
      <JsonLd data={[generateQAPageSchema(question), generateBreadcrumbSchema(breadcrumbs)]} />
      <QuestionDetailClient question={question} />
    </>
  );
}
