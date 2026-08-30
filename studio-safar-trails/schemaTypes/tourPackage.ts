import { defineField, defineType } from 'sanity';

export const tourPackage = defineType({
  name: 'tourPackage',
  title: 'Tour Package',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      description: 'Lower numbers show first on the packages listing. Leave blank to sort alphabetically after ordered packages.',
      type: 'number',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (INR, per person)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      description: 'e.g. "6 Days / 5 Nights"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'itineraryDay',
          title: 'Day',
          fields: [
            defineField({
              name: 'day',
              title: 'Day Number',
              type: 'number',
              validation: (Rule) => Rule.required().positive().integer(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: { day: 'day', title: 'title' },
            prepare({ day, title }) {
              return { title: `Day ${day ?? '?'}: ${title ?? ''}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'inclusions',
      title: 'Inclusions',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'exclusions',
      title: 'Exclusions',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO: Meta Title (Legacy)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO: Meta Description (Legacy)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'tagline',
      title: 'Hero Subtitle / Tagline',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'startingPoint',
      title: 'Starting Point',
      description: 'e.g. "Delhi / Haridwar"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'travelType',
      title: 'Travel Type',
      description: 'e.g. "Private / Group"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
      rows: 5,
      group: 'content',
    }),
    defineField({
      name: 'whatIsSection',
      title: 'What is this Yatra/Trip? (intro paragraph)',
      type: 'text',
      rows: 5,
      group: 'content',
    }),
    defineField({
      name: 'stopsCovered',
      title: 'Stops / Dhams Covered',
      description: 'Rich detail on each major stop (e.g. each of the four dhams).',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'stopCovered',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'name' } },
        },
      ],
    }),
    defineField({
      name: 'placesCovered',
      title: 'Places Covered',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'bestTimeSections',
      title: 'Best Time to Visit',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'bestTimeSection',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),
    defineField({
      name: 'howToReach',
      title: 'How to Reach',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'road', title: 'By Road', type: 'text', rows: 2 }),
        defineField({ name: 'rail', title: 'By Train', type: 'text', rows: 2 }),
        defineField({ name: 'air', title: 'By Air', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'costNote',
      title: 'Package Cost — Intro Note',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'costFactors',
      title: 'What Affects Package Cost',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'accommodationNote',
      title: 'Accommodation — Note',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'accommodationOptions',
      title: 'Accommodation Options',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'transportationOptions',
      title: 'Transportation Options',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'customizeOptions',
      title: 'Customize Your Package — Options',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'whoCanBook',
      title: 'Who Can Book',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'travelTips',
      title: 'Travel Tips',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'whyChooseUs',
      title: 'Why Choose Safar Trails',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),
    defineField({
      name: 'bottomCtaHeading',
      title: 'Bottom CTA — Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'bottomCtaText',
      title: 'Bottom CTA — Text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
  ],
  groups: [
    { name: 'content', title: 'Page Content' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'duration',
      media: 'images.0',
    },
  },
});
