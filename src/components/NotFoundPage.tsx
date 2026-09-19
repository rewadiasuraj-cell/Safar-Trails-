import { Link } from 'react-router-dom';
import { Compass, MapPin, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../lib/seo/siteConfig';
import { trackWhatsAppClick } from '../lib/analytics';

/**
 * Real 404 page.
 *
 * Previously every unknown URL rendered <Navigate to="/" />, which is a textbook
 * soft 404: the server answered 200, the crawler saw homepage content at a junk
 * URL, and Google ends up indexing garbage or distrusting the whole site's
 * status codes. This page states plainly that the URL is gone, is marked
 * noindex by the SEO layer, and offers real next steps instead of a silent
 * redirect.
 */
export function NotFoundPage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hi Safar Trails! I was looking for a trip page on your website. Can you help me find it?',
  )}`;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Error 404</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          This page could not be found
        </h1>
        <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
          The link may be out of date or mistyped. Start from our destinations, packages or travel
          guides — or send us your dates and we will build the itinerary for you.
        </p>

        <nav aria-label="Helpful links" className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            to="/destinations"
            className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 p-6 text-stone-800 transition-colors hover:border-stone-900 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <MapPin className="h-6 w-6" aria-hidden="true" />
            <span className="font-semibold">Browse destinations</span>
          </Link>
          <Link
            to="/packages"
            className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 p-6 text-stone-800 transition-colors hover:border-stone-900 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <Compass className="h-6 w-6" aria-hidden="true" />
            <span className="font-semibold">See holiday packages</span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('404_page')}
            className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 p-6 text-stone-800 transition-colors hover:border-stone-900 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            <span className="font-semibold">Ask us on WhatsApp</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
