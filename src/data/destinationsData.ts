// Destination content now lives as one JSON file per destination under
// content/destinations/, so it can be edited from the GitHub web UI without
// touching code. scripts/build-content.ts validates those files and generates
// the module re-exported here.
//
// To add or change a destination, edit content/destinations/<slug>.json.
export { destinationsData } from './generated/destinations';
