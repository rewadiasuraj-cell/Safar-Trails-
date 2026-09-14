// Package content now lives as one JSON file per package under content/packages/,
// so it can be edited from the GitHub web UI without touching code.
// scripts/build-content.ts validates those files and generates the module
// re-exported here.
//
// To add or change a package, edit content/packages/<slug>.json.
export { packagesData } from './generated/packages';
