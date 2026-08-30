import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO & Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Meta Title)',
      type: 'string',
      description: 'Overrides default page title. Recommended length: 50-60 characters.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Overrides default meta description. Recommended length: 150-160 characters.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (Open Graph / Twitter)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      description: 'Target primary SEO keyword for content tracking.',
    }),
    defineField({
      name: 'noIndex',
      title: 'NoIndex (Hide from Search Engines)',
      type: 'boolean',
      description: 'Check to prevent search engines from indexing this page.',
      initialValue: false,
    }),
  ],
});
