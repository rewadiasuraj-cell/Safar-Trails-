/** Maps both public URL spellings to the navigation's active view. */
export function pathToView(pathname: string): string {
  pathname = pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/') return 'home';
  if (pathname === '/destinations') return 'destinations';
  if (pathname.startsWith('/destinations/')) return 'destination-detail';
  if (pathname === '/packages') return 'packages';
  if (pathname === '/ai-planner') return 'ai-planner';
  if (pathname === '/guides' || pathname === '/blog') return 'guides';
  if (pathname.startsWith('/guides/') || pathname.startsWith('/blog/')) return 'guide-detail';
  if (pathname === '/about-us') return 'why-us';
  if (pathname === '/contact-us') return 'contact-us';
  return 'home';
}
