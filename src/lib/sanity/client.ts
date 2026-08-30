import { createClient } from '@sanity/client';

// Project ID and dataset are not secret - Sanity's own docs recommend
// shipping them in the client bundle since read queries need them.
// Override via .env if you ever point the app at a different project/dataset.
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const sanityProjectId: string = env.VITE_SANITY_PROJECT_ID || 'xmtc060o';
export const sanityDataset: string = env.VITE_SANITY_DATASET || 'production';
const apiVersion: string = env.VITE_SANITY_API_VERSION || '2024-06-01';

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion,
  useCdn: true,
});
