import React from 'react';
import { PackagesPage as SanityPackagesPage } from '../../src/components/Sanity/PackagesPage';
import type { Route } from './+types/packages';

export const meta: Route.MetaFunction = () => [
  { title: "All India Tour Packages — Customized Holiday Packages | Safar Trails" },
  { name: "description", content: "Browse curated holiday packages across India. Kashmir, Goa, Kerala, Rajasthan, Himachal & Andaman packages tailored for couples, families & solo travelers." },
  { property: "og:title", content: "All India Tour Packages — Customized Holiday Packages | Safar Trails" },
  { property: "og:description", content: "Browse curated holiday packages across India. Kashmir, Goa, Kerala, Rajasthan, Himachal & Andaman packages tailored for couples, families & solo travelers." },
  { property: "og:url", content: "https://safartrails.co.in/packages" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export default function PackagesRoute() {
  return (
    <div className="pt-20">
      <SanityPackagesPage />
    </div>
  );
}
