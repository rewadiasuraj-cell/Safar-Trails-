// Guide content now lives as one JSON file per guide under content/guides/, so it
// can be edited from the GitHub web UI without touching code.
// scripts/build-content.ts validates those files and generates the module
// re-exported here.
//
// To add or change a guide, edit content/guides/<slug>.json.
export { guidesData } from './generated/guides';
