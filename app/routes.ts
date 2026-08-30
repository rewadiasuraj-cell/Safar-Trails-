import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("destinations", "routes/destinations.tsx"),
  route("destinations/:slug", "routes/destination-detail.tsx"),
  route("packages", "routes/packages.tsx"),
  route("packages/:slug", "routes/package-detail.tsx"),
  route("destinations/:destSlug/packages/:pkgSlug", "routes/destination-package-detail.tsx"),
  route("tour-packages/:slug", "routes/tour-package-detail.tsx"),
  route("ai-planner", "routes/ai-planner.tsx"),
  route("guides", "routes/guides.tsx"),
  route("guides/:slug", "routes/guide-detail.tsx"),
  route("about-us", "routes/about-us.tsx"),
  route("contact-us", "routes/contact-us.tsx"),
  route("*", "routes/splat.tsx"),
] satisfies RouteConfig;
