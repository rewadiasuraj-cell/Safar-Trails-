import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';

type State = 'idle' | 'sending' | 'done' | 'error';

/**
 * The footer subscription box.
 *
 * It posts to /api/subscribe, which emails the address to the owner. There is
 * no mailing list behind it yet, so the confirmation says what actually
 * happened - "we'll be in touch" - rather than "you're subscribed", which
 * would be a promise nothing on the other end is keeping.
 *
 * It does not reuse /api/quotes. That endpoint requires a name and a phone
 * number and drops what it receives into the owner's enquiry inbox; a
 * subscriber has neither, and their address is not a lead.
 */
export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(data.error || 'Something went wrong. Try again in a moment.');
        return;
      }
      setState('done');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Could not reach the server. Check your connection and try again.');
    }
  };

  if (state === 'done') {
    return (
      <div className="flex items-start gap-2.5 text-sm text-white">
        <span className="shrink-0 w-6 h-6 rounded-full bg-whatsapp flex items-center justify-center mt-0.5">
          <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </span>
        <p className="leading-relaxed">
          Got it — we have your address and will be in touch when there is
          something worth sending.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="newsletter-email" className="block text-[11px] font-bold text-white uppercase tracking-widest mb-2">
        Get exclusive travel deals in your inbox
      </label>
      <div className="flex flex-col sm:flex-row gap-2 max-w-md">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" aria-hidden="true" />
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
            aria-invalid={state === 'error'}
            className="w-full pl-10 pr-3 py-3 rounded-full bg-white/10 border border-white/25 text-sm text-white placeholder:text-stone-400 focus:outline-none focus:border-white/70"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-warm-orange hover:brightness-105 text-cta-ink font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          <span>{state === 'sending' ? 'Sending…' : 'Subscribe'}</span>
          {state !== 'sending' && <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />}
        </button>
      </div>
      {state === 'error' && (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs text-[#FFB59A]">
          {message}
        </p>
      )}
    </form>
  );
};
