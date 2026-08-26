import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Twitter, Sparkles, X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FloatingShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  variant?: 'floating' | 'button' | 'pill' | 'icon';
  positionClassName?: string;
  className?: string;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({
  title,
  text,
  url,
  variant = 'floating',
  positionClassName = 'fixed bottom-6 right-6 z-40',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title,
      text: text || `Check out ${title} on SafarTrails!`,
      url: shareUrl
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User closed the share sheet
          return;
        }
        // If native share fails, fallback to menu / copy
      }
    }

    // Fallback if Web Share API is not available or rejected
    copyToClipboard(shareUrl);
  };

  const copyToClipboard = async (linkToCopy?: string) => {
    const targetLink = linkToCopy || getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetLink);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = targetLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2500);
    } catch (err) {
      setShowDropdown(true);
    }
  };

  const shareUrl = getShareUrl();
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${text || 'Explore on SafarTrails'}\n${shareUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;

  // Floating Action Button rendering
  if (variant === 'floating') {
    return (
      <>
        {/* Floating Share Button */}
        <div className={`${positionClassName} ${className}`}>
          <div className="relative">
            <button
              onClick={handleNativeShare}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowDropdown(!showDropdown);
              }}
              className="group flex items-center gap-2.5 px-4 py-3 sm:py-3.5 bg-slate-900 hover:bg-black text-white rounded-full shadow-[0_8px_25px_-4px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_30px_-4px_rgba(255,107,0,0.35)] border border-slate-700/80 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Share this travel page with friends"
              aria-label="Share this travel page"
            >
              <div className="relative">
                <Share2 className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B00] rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase font-sans">
                Share Trip
              </span>
            </button>

            {/* Quick Share Dropdown Popover */}
            {showDropdown && (
              <div className="absolute bottom-full right-0 mb-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Share With Friends</span>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-medium transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span>X (Twitter)</span>
                  </a>

                  <button
                    onClick={() => {
                      copyToClipboard();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Toast Indicator */}
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">
              {copied ? 'Link copied to clipboard! Share with friends' : 'Shared successfully!'}
            </span>
          </div>
        )}
      </>
    );
  }

  // Pill / Inline button rendering
  if (variant === 'pill') {
    return (
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-xs ${className}`}
        title="Share with friends"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Share</span>
          </>
        )}
      </button>
    );
  }

  // Icon Button rendering
  return (
    <button
      onClick={handleNativeShare}
      className={`p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer border border-white/15 hover:border-orange-400/60 ${className}`}
      title="Share page"
      aria-label="Share page"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-orange-300" />}
    </button>
  );
};
