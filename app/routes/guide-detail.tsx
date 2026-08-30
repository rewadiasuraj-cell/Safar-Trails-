import React from 'react';
import { guidesData } from '../../src/data/guidesData';
import { GuideDetailPage as SanityGuideDetailPage } from '../../src/components/Sanity/GuideDetailPage';
import type { Route } from './+types/guide-detail';

export const meta: Route.MetaFunction = (arg) => {
  const params = arg?.params || {};
  const slug = params.slug || '';
  const staticFallback = guidesData.find(g => g.slug === slug);
  const titleText = staticFallback?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = `${titleText} | Safar Trails Travel Guide`;
  const rawDesc = staticFallback?.excerpt || staticFallback?.readTime || `Read our expert travel guide for ${titleText} with Safar Trails. Top places to visit, trip costs & local tips.`;
  const description = rawDesc.replace(/(<([^>]+)>)/gi, '').slice(0, 155);
  const ogImage = staticFallback?.heroImage || 'https://safartrails.co.in/og-image.jpg';

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: `https://safartrails.co.in/guides/${slug}` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://safartrails.co.in/guides/${slug}` },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
};

export default function GuideDetailRoute({ params }: Route.ComponentProps) {
  const slug = params?.slug || '';
  const guide = guidesData.find(g => g.slug === slug);
  const titleText = guide?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const description = (guide?.excerpt || `Read our expert travel guide for ${titleText} with Safar Trails.`).slice(0, 155);
  const image = guide?.heroImage || 'https://safartrails.co.in/og-image.jpg';

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: titleText,
    description: description,
    image: [image],
    author: {
      '@type': 'Organization',
      name: 'SafarTrails Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SafarTrails',
      logo: {
        '@type': 'ImageObject',
        url: 'https://safartrails.co.in/logo.svg',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://safartrails.co.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://safartrails.co.in/guides',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: titleText,
        item: `https://safartrails.co.in/guides/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SanityGuideDetailPage />
    </>
  );
}
