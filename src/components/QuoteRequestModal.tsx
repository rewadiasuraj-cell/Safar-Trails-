import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { trackQuoteFormSubmit, trackQuoteFormSuccess, trackWhatsAppClick } from '../lib/analytics';
import { WHATSAPP_NUMBER } from '../lib/seo/siteConfig';
import { 
  X, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  IndianRupee,
  Loader2,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSummary?: string;
  initialDestination?: string;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  initialSummary = '',
  initialDestination = ''
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState(initialDestination || 'Kashmir');
  const [travelDates, setTravelDates] = useState('');
  // These two must match an <option value> below exactly, or the select shows the
  // first option while the state holds something else - and the enquiry records a
  // value nobody chose. '2 Adults' used to do precisely that.
  const [travellers, setTravellers] = useState('2 Adults (Couple/Honeymoon)');
  const [budget, setBudget] = useState('Standard (₹15k–₹25k/person)');
  const [notes, setNotes] = useState(initialSummary);

  /**
   * The audit measured this form at seven fields and recommended four. Only name
   * and phone are actually required, so the other five were costing enquiries
   * purely by making the form look long. They are collapsed rather than deleted:
   * the request body is unchanged, and anyone who wants to give more detail
   * still can.
   *
   * It starts open when the AI planner passes an itinerary in, because that text
   * is prefilled into notes and the sender should be able to see what is being
   * sent on their behalf.
   */
  const [showMore, setShowMore] = useState(Boolean(initialSummary));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync props when modal is opened or props change
  useEffect(() => {
    if (isOpen) {
      if (initialDestination) {
        setDestination(initialDestination);
      }
      if (initialSummary) {
        setNotes(initialSummary);
        // The useState initialiser only runs on first mount, and this modal stays
        // mounted between opens - so the planner path has to re-open the section
        // here, not just on mount.
        setShowMore(true);
      }
      setSubmittedLead(null);
      setErrorMsg(null);
    }
  }, [isOpen, initialDestination, initialSummary]);

  if (!isOpen) return null;

  // Fire-and-forget: notifies LEAD_NOTIFICATION_EMAIL (siteConfig) via the Resend-backed
  // /api/send-quote-email function. Never awaited and never throws into the
  // caller, so a failure here can't block the enquiry or the WhatsApp flow.
  const sendQuoteEmailNotification = (leadId: string) => {
    fetch('/api/send-quote-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId,
        name,
        phone,
        email,
        destination,
        travelDates: travelDates || 'Flexible',
        travellers,
        budget,
        specialNotes: notes,
        itinerarySummary: initialSummary
      })
    }).catch((err) => {
      console.error('Quote email notification failed (enquiry was still submitted):', err);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    trackQuoteFormSubmit(destination, 'quote_modal');

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          destination,
          travelDates,
          travellers,
          budget,
          itinerarySummary: initialSummary,
          specialNotes: notes
        })
      });

      const data = await response.json();
      if (data.success) {
        trackQuoteFormSuccess(destination, data.leadId);
        // /api/quotes already sends the notification email itself (server.ts
        // and the Cloudflare Pages Function both do) - no separate call here,
        // or it would double-send on hosts where that endpoint works.
        setSubmittedLead(data);
      } else {
        throw new Error(data.error || 'Failed to submit quote request');
      }
    } catch (err: any) {
      console.error('Quote submission error:', err);
      // Fallback success for demo
      const fallbackId = `ST-${Date.now().toString().slice(-6)}`;
      const encodedMsg = encodeURIComponent(
        `Hi SafarTrails! I submitted an enquiry for ${destination}.\n` +
        `Dates: ${travelDates || 'Upcoming'}\n` +
        `Travellers: ${travellers}\n` +
        `Name: ${name} (${phone})\n` +
        `Notes: ${notes || initialSummary}`
      );
      // The lead still reaches us over WhatsApp on this path, so it counts.
      trackQuoteFormSuccess(destination, fallbackId);
      setSubmittedLead({
        leadId: fallbackId,
        whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`
      });
      // /api/quotes itself failed/unreachable, so no server-side email was
      // ever attempted - this is the one remaining path where the separate
      // notification call is still needed.
      sendQuoteEmailNotification(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#0F172A] p-6 text-white relative border-b border-stone-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-stone-300 text-[10px] font-bold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Direct Specialist Connection</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Get Your Custom Trip Quote
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-normal">
            Zero commitment. 100% itemized pricing with hotel room categories.
          </p>
        </div>

        {/* Form or Success State */}
        {submittedLead ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6 bg-[#F2F8FC]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Enquiry Reference ID
              </span>
              <div className="text-2xl font-black text-black tracking-widest mt-0.5">
                #{submittedLead.leadId}
              </div>
              <h3 className="text-lg font-serif font-bold text-black mt-2">
                Thank you, {name}!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
                Your request has been routed to our senior destination coordinator. We will reach out on WhatsApp within 3 hours.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={submittedLead.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('quote_modal_success', destination)}
                className="w-full py-3.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2.5"
              >
                <WhatsAppIcon className="w-4.5 h-4.5" aria-hidden="true" />
                <span>Continue on WhatsApp Now</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:border-black cursor-pointer"
              >
                Back to Website
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#F2F8FC]">
            {errorMsg && (
              <div
                id="quote-form-error"
                role="alert"
                className="p-3 rounded-xl bg-red-50 text-red-800 text-xs font-semibold border border-red-300"
              >
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="quote-name"
                  className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
                >
                  Full Name <span aria-hidden="true" className="text-red-600">*</span>
                </label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-required="true"
                  aria-describedby={errorMsg ? 'quote-form-error' : undefined}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-phone"
                  className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
                >
                  WhatsApp / Phone <span aria-hidden="true" className="text-red-600">*</span>
                </label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  aria-required="true"
                  aria-describedby={errorMsg ? 'quote-form-error' : undefined}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 80766 65782"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="quote-destination"
                  className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
                >
                  Destination
                </label>
                <select
                  id="quote-destination"
                  name="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 font-bold bg-white focus:border-black focus:outline-none"
                >
                  <option value="Kashmir">Kashmir</option>
                  <option value="Goa">Goa</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Andaman">Andaman & Nicobar</option>
                  <option value="Meghalaya">Meghalaya / Northeast</option>
                  <option value="Northeast India">Northeast India</option>
                  {destination && !['Kashmir', 'Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Ladakh', 'Uttarakhand', 'Andaman', 'Meghalaya', 'Northeast India', 'Custom Multi-City'].includes(destination) && (
                    <option value={destination}>{destination}</option>
                  )}
                  <option value="Custom Multi-City">Other Custom Tour</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quote-dates"
                  className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
                >
                  Travel Month/Date
                </label>
                <input
                  id="quote-dates"
                  name="travelDates"
                  type="text"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  placeholder="e.g. Next Month / Diwali"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMore((open) => !open)}
              aria-expanded={showMore}
              aria-controls="quote-more-details"
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-stone-300 text-[11px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 hover:border-stone-400 bg-white cursor-pointer"
            >
              <span>
                {showMore ? 'Hide extra details' : 'Add trip details (optional)'}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`w-4 h-4 flex-shrink-0 transition-transform ${showMore ? 'rotate-180' : ''}`}
              />
            </button>

            <div id="quote-more-details" hidden={!showMore} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="quote-travellers"
                  className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
                >
                  Travellers
                </label>
                <select
                  id="quote-travellers"
                  name="travellers"
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:border-black focus:outline-none"
                >
                  <option value="2 Adults (Couple/Honeymoon)">2 Adults (Couple / Honeymoon)</option>
                  <option value="Family (2 Adults + 1-2 Kids)">Family (2 Adults + 1-2 Kids)</option>
                  <option value="Family with Parents (4+ Adults)">Family with Parents (4+ Adults)</option>
                  <option value="Friends Group (3-6 Adults)">Friends Group (3-6 Adults)</option>
                  <option value="Solo Traveler">Solo Traveler</option>
                  <option value="Corporate / Large Group">Corporate / Large Group</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quote-budget"
                  className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
                >
                  Budget Preference
                </label>
                <select
                  id="quote-budget"
                  name="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:border-black focus:outline-none"
                >
                  <option value="Standard (₹15k–₹25k/person)">Standard 3★ (₹15k–₹25k/person)</option>
                  <option value="Deluxe (₹25k–₹40k/person)">Deluxe 4★ (₹25k–₹40k/person)</option>
                  <option value="Luxury (₹40k+/person)">Luxury 5★ / Heritage (₹40k+/person)</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-email"
                className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
              >
                Email (Optional)
              </label>
              <input
                id="quote-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="quote-notes"
                className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1"
              >
                Special Requests or Notes (Optional)
              </label>
              <textarea
                id="quote-notes"
                name="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Want Dal lake houseboat with central heating, need vegetarian meals, child car seat..."
                className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 resize-none bg-white focus:border-black focus:outline-none"
              />
            </div>
            </div>

            <button
              id="submit-quote-request-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-black hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-luxury-gold" />
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <span>Request Free Itemized Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
