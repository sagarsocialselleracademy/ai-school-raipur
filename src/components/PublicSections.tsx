import React, { useEffect, useRef, useState } from 'react';
import {
  CourseItem,
  DEFAULTS,
  FaqItem,
  NavItem,
  PageSection,
  SiteSettings,
  TestimonialItem,
  WORKSHOP_PASSES,
  WORKSHOP_TICKETS,
  WorkshopPass,
  WorkshopTicket,
} from '@/lib/data';
import { PixelTracker } from '@/lib/pixel';
import {
  fallbackIfDead,
  resolveAssetUrl,
  resolveAttendeeThumb,
  resolveAttendeeVideo,
  resolveFeaturedVideo,
  resolveGalleryImage,
  resolveLogoUrl,
  resolveMediaClipping,
  resolveSpeakerLogo,
  resolveTeamImage,
  resolveTrackIcon,
  resolveTrackImage,
  resolveWhatsappScreenshot,
} from '@/lib/cms';

const HASH_TARGETS = new Set(['', '#', '#register', '#contact', '#cta', '#tickets', '#passes']);

function isHashPlaceholder(url?: string): boolean {
  return HASH_TARGETS.has((url || '').trim().toLowerCase());
}

export function resolveButtonHref(url?: string, fallback = '#passes'): string {
  const trimmed = (url || '').trim();
  return trimmed || fallback.trim() || '#passes';
}

export function resolveCtaHref(primaryUrl?: string, globalRegisterUrl?: string): string {
  const globalTrimmed = (globalRegisterUrl || '').trim();
  if (globalTrimmed && !isHashPlaceholder(globalTrimmed)) return globalTrimmed;
  const primaryTrimmed = (primaryUrl || '').trim();
  if (primaryTrimmed && !isHashPlaceholder(primaryTrimmed)) return primaryTrimmed;
  return globalTrimmed || primaryTrimmed || '#passes';
}

export function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href);
}

export function formatWhatsappUrl(rawPhone?: string, text?: string): string {
  const raw = (rawPhone || '').trim();
  const match = raw.match(/(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d+)/i);
  const digits = ((match ? match[1] : raw) || DEFAULTS.WHATSAPP_NUMBER).replace(/\D/g, '');
  const normalized = digits.length === 10 ? `91${digits}` : digits || `91${DEFAULTS.WHATSAPP_NUMBER}`;
  const base = `https://wa.me/${normalized}`;
  return text?.trim() ? `${base}?text=${encodeURIComponent(text.trim())}` : base;
}

function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

function parseTimestamp(iso?: string): number | null {
  const trimmed = (iso || '').trim();
  if (!trimmed) return null;
  const ms = Date.parse(trimmed);
  return Number.isNaN(ms) ? null : ms;
}

export function useCountdown(targetIso?: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const targetMs = parseTimestamp(targetIso);
    if (targetMs == null) return;
    setNow(Date.now());
    if (targetMs <= Date.now()) return;
    const id = window.setInterval(() => {
      const curr = Date.now();
      setNow(curr);
      if (curr >= targetMs) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  const targetMs = parseTimestamp(targetIso);
  if (targetMs == null) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      timeString: '00d : 00h : 00m : 00s',
      compactTimeString: '00d 00h 00m 00s',
      expired: false,
      label: 'Starts soon',
      compactLabel: 'Starts soon',
    };
  }

  const diff = Math.max(0, targetMs - now);
  const expired = diff <= 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const timeString = `${pad2(days)}d : ${pad2(hours)}h : ${pad2(minutes)}m : ${pad2(seconds)}s`;
  const compactTimeString = `${pad2(days)}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;

  return {
    days: pad2(days),
    hours: pad2(hours),
    minutes: pad2(minutes),
    seconds: pad2(seconds),
    timeString,
    compactTimeString,
    expired,
    label: expired
      ? 'Event is Live Now'
      : `Event Starts in ${timeString}`,
    compactLabel: expired
      ? 'Live Now'
      : `Starts in ${timeString}`,
  };
}

export function useEvergreenTimer(durationMinutes = 30) {
  const durationSeconds = durationMinutes * 60;
  // Always restarts fresh on every new visit or page reload
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    const startMs = Date.now();
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const remaining = durationSeconds - elapsed;
      if (remaining <= 0) {
        setSecondsLeft(durationSeconds - (elapsed % durationSeconds));
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [durationSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${pad2(minutes)}m : ${pad2(seconds)}s`;

  return {
    label: `Offer Expiring in ${timeString}`,
    compactLabel: `Offer Expiring in ${timeString}`,
    timeString,
    minutes: pad2(minutes),
    seconds: pad2(seconds),
  };
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function MapPinIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function SectionIcon({ name, size = 16 }: { name?: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name?.toLowerCase()) {
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'users':
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'send':
      return (
        <svg {...props}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'code':
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'file':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'play':
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'video':
      return (
        <svg {...props}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...props}>
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
        </svg>
      );
  }
}

function CalendarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}



function UtensilsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 2v8h-3a4 4 0 0 1-4-4V2" />
      <path d="M2 12h12" />
      <path d="M7 2v20" />
      <path d="M21 15a4 4 0 0 1-4 4h-2" />
    </svg>
  );
}

function ZapIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function openPassModal() {
  if (typeof window !== 'undefined') {
    window.location.href = 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view';
  }
}

export function closePassModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('close-pass-modal'));
  }
}

export function Topbar({ settings }: { settings: SiteSettings }) {
  const targetIso = settings.eventStartsAt || '2026-11-29T10:00:00+05:30';
  const { timeString, expired } = useCountdown(targetIso);
  const checkoutUrl = 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view';

  const handleCtaClick = () => {
    PixelTracker.initiateCheckout(settings.registerLabel || 'Register Now', checkoutUrl);
  };

  return (
    <div className="topbar">
      <div className="topbar__content">
        <span className="topbar__timer" aria-live="polite">
          <ClockIcon />
          <span className="topbar-timer-text-desktop">
            {expired ? 'Event is Live Now' : `Event Starts in ${timeString}`}
          </span>
          <span className="topbar-timer-text-mobile">
            {expired ? 'Live Now' : `Starts in ${timeString}`}
          </span>
        </span>
        <a
          className="topbar__cta"
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
        >
          <span className="topbar-cta-full">{settings.registerLabel || 'Register Now'}</span>
          <span className="topbar-cta-short">Register</span>
          <ArrowRightIcon />
        </a>
      </div>
    </div>
  );
}

function BrandLogo({
  src,
  alt,
  imageClassName,
  nameClassName,
}: {
  src?: string;
  alt: string;
  imageClassName: string;
  nameClassName: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <p className={nameClassName}>{alt}</p>;
  }
  return (
    <img
      src={resolveAssetUrl(src)}
      alt={alt}
      className={imageClassName}
      onError={() => setFailed(true)}
    />
  );
}

export function BrandHeader({ settings }: { settings: SiteSettings }) {
  // Hero logo removed per user instruction
  return null;
}

function parsePhones(raw?: string | string[]): string[] {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .split(/[,|\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function PublicFooter({ settings }: { settings: SiteSettings }) {
  const footerJson = settings.footerJson || ({} as SiteSettings['footerJson']);
  const description = String(footerJson.description || '') || DEFAULTS.FOOTER_DESCRIPTION;
  const copyright = String(footerJson.copyright || '') || DEFAULTS.COPYRIGHT;
  const tagline = String(footerJson.tagline || '') || DEFAULTS.FOOTER_BY;
  const logoSrc = resolveLogoUrl(settings.logoUrl);

  const rawPhones = parsePhones(footerJson.phones)
    .concat(parsePhones(settings.phone))
    .filter((p) => p && !/00000/.test(p));
  const phones = rawPhones.length ? Array.from(new Set(rawPhones)) : [...DEFAULTS.PHONES];

  const address =
    settings.address && !settings.address.includes('Startup Incubation Center, Raipur')
      ? settings.address
      : DEFAULTS.ADDRESS;

  const yt =
    !settings.socialLinks?.youtube || settings.socialLinks.youtube === 'https://youtube.com'
      ? DEFAULTS.YOUTUBE
      : settings.socialLinks.youtube;
  const ig =
    !settings.socialLinks?.instagram || settings.socialLinks.instagram === 'https://instagram.com'
      ? DEFAULTS.INSTAGRAM
      : settings.socialLinks.instagram;

  return (
    <footer className="public-footer-wrap">
      <div className="public-footer container">
        <div className="footer-brand">
          <BrandLogo
            src={logoSrc}
            alt={settings.websiteName}
            imageClassName="footer-logo"
            nameClassName="footer-logo-name"
          />
          <p className="footer-by">{tagline}</p>
          <p className="muted">{description}</p>
          <div className="footer-social">
            {yt ? (
              <a
                className="social-btn social-btn--yt"
                href={yt}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            ) : null}
            {ig ? (
              <a
                className="social-btn social-btn--ig"
                href={ig}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            ) : null}
          </div>
        </div>
        <div className="footer-contact">
          {settings.contactEmail ? (
            <a className="footer-line" href={`mailto:${settings.contactEmail}`}>
              <MailIcon />
              <span>{settings.contactEmail}</span>
            </a>
          ) : null}
          {phones.map((ph) => (
            <a key={ph} className="footer-line" href={`tel:${ph.replace(/[^\d+]/g, '')}`}>
              <PhoneIcon />
              <span>{ph}</span>
            </a>
          ))}
          {address ? (
            <div className="footer-line footer-line--address">
              <MapPinIcon />
              <span>{address}</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="footer-bottom container">
        <small>{copyright}</small>
      </div>
    </footer>
  );
}

export function ScrollTopButton() {
  return (
    <button
      className="scroll-top"
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUpIcon />
    </button>
  );
}

export function PublicShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  navigation?: NavItem[];
  children: React.ReactNode;
}) {
  useEffect(() => {
    let scrollTimeout: any = null;
    let settleTimeout: any = null;

    const triggerVisibleButtonsShake = () => {
      const buttons = document.querySelectorAll<HTMLElement>(
        '.hero-cta .cta-btn, .cta-card .cta-btn, .timeline-footer-cta .cta-btn, .topics-reserve-btn, .modal-pass-btn, .pass-btn'
      );
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          btn.classList.remove('cta-scroll-shake');
          void btn.offsetWidth; // Force reflow
          btn.classList.add('cta-scroll-shake');
          setTimeout(() => btn.classList.remove('cta-scroll-shake'), 750);
        }
      });
    };

    const handleScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          triggerVisibleButtonsShake();
          scrollTimeout = null;
        }, 120);
      }
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        triggerVisibleButtonsShake();
      }, 2200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(settleTimeout);
    };
  }, []);

  return (
    <div className="public-shell">
      <Topbar settings={settings} />
      {children}
      <PublicFooter settings={settings} />
      <ScrollTopButton />
      <PassModal settings={settings} />
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function extractWistiaId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const m = trimmed.match(/(?:wistia\.(?:com|net)\/(?:medias|embed\/iframe)\/|wistia:)([A-Za-z0-9_-]+)/i);
  if (m) return m[1];
  if (/^[a-z0-9]{10}$/i.test(trimmed)) return trimmed;
  return null;
}

export function VideoPlayer({
  video,
  title,
  autoPlay = false,
  muted,
  controls,
  preload,
}: {
  video?: { url?: string; poster?: string; source?: string } | null;
  title: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const url = video?.url || '';
  const poster = video?.poster ? resolveAssetUrl(video.poster) : '';
  const requestedMuted = muted ?? false;
  const [isMutedState, setIsMutedState] = useState(requestedMuted);
  const hasControls = controls ?? true;
  const preloadMode = preload ?? (autoPlay ? 'auto' : 'metadata');
  const ytId = extractYoutubeId(url);
  const vimeoId = extractVimeoId(url);
  const wistiaId = extractWistiaId(url) || (video?.source === 'wistia' ? extractWistiaId(url) || '2rlct1fyzb' : null);

  useEffect(() => {
    if (typeof window === 'undefined' || !wistiaId) return;
    if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
      const s1 = document.createElement('script');
      s1.src = 'https://fast.wistia.com/player.js';
      s1.async = true;
      document.head.appendChild(s1);
    }
    const embedSrc = `https://fast.wistia.com/embed/${wistiaId}.js`;
    if (!document.querySelector(`script[src*="${wistiaId}"]`)) {
      const s2 = document.createElement('script');
      s2.src = embedSrc;
      s2.async = true;
      s2.type = 'module';
      document.head.appendChild(s2);
    }
  }, [wistiaId]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlay) return;

    // Attempt unmuted playback when requestedMuted is false
    el.muted = requestedMuted;
    el.volume = 1.0;
    setIsMutedState(requestedMuted);

    const p = el.play();
    if (p) {
      p.catch(() => {
        // If autoplay with sound was blocked by browser policy:
        // Start muted so the video doesn't freeze
        el.muted = true;
        setIsMutedState(true);
        el.play().catch(() => {});

        // Automatically unmute on the very first user interaction anywhere on the page
        if (!requestedMuted) {
          const interactionEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'scroll'];
          const handleFirstGesture = () => {
            if (el) {
              el.muted = false;
              el.volume = 1.0;
              setIsMutedState(false);
              el.play().catch(() => {});
              setTimeout(() => {
                if (el && el.paused) el.play().catch(() => {});
              }, 60);
            }
            interactionEvents.forEach((evt) =>
              window.removeEventListener(evt, handleFirstGesture, true)
            );
          };
          interactionEvents.forEach((evt) =>
            window.addEventListener(evt, handleFirstGesture, { capture: true, once: true })
          );
        }
      });
    }
  }, [autoPlay, requestedMuted, url]);

  const handlePlayClick = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1.0;
    setIsMutedState(false);
    const p = el.play();
    if (p) p.catch(() => {});
  };

  const handleUnmuteBadgeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1.0;
    setIsMutedState(false);
    el.play().catch(() => {});
  };

  if (ytId) {
    const params = new URLSearchParams({ rel: '0', controls: '1' });
    if (autoPlay) {
      params.set('autoplay', '1');
      if (requestedMuted) params.set('mute', '1');
    }
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (vimeoId) {
    const params = new URLSearchParams({ controls: '1' });
    if (autoPlay && requestedMuted) {
      params.set('autoplay', '1');
      params.set('muted', '1');
    }
    const qs = params.toString();
    return (
      <iframe
        title={title}
        src={`https://player.vimeo.com/video/${vimeoId}${qs ? `?${qs}` : ''}`}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    );
  }

  if (wistiaId) {
    return (
      <div
        className="wistia-player-container"
        dangerouslySetInnerHTML={{
          __html: `<wistia-player media-id="${wistiaId}" aspect="1.7777777777777777"></wistia-player>`,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  if (url) {
    return (
      <>
        <video
          ref={videoRef}
          loop={autoPlay && isMutedState}
          playsInline
          controls={hasControls}
          preload={preloadMode}
          poster={poster}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onVolumeChange={() => {
            if (videoRef.current) {
              setIsMutedState(videoRef.current.muted);
            }
          }}
        >
          <source src={resolveAssetUrl(url)} type="video/mp4" />
        </video>
        {isMutedState && !requestedMuted && playing ? (
          <button
            type="button"
            className="unmute-badge-btn"
            onClick={handleUnmuteBadgeClick}
            aria-label="Unmute video"
          >
            <span>🔊 Tap for Sound</span>
          </button>
        ) : null}
        {hasControls && !playing ? (
          <button
            className="video-play-hit"
            type="button"
            onClick={handlePlayClick}
            aria-label={`Play ${title}`}
          >
            <span className="play-badge play-badge--lg">▶</span>
          </button>
        ) : null}
      </>
    );
  }

  if (poster) {
    return <img src={poster} alt={title} />;
  }

  return null;
}

function asObj(v: any): Record<string, any> {
  return v && typeof v === 'object' ? v : {};
}
function asArr(v: any): any[] {
  return Array.isArray(v) ? v : [];
}
function asStr(v: any, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function trimStr(v: any): string {
  return asStr(v).trim();
}
function hasAnyStr(...vals: any[]): boolean {
  return vals.some((v) => trimStr(v).length > 0);
}
function hasAnyArr(v: any): boolean {
  return asArr(v).length > 0;
}

export function CtaButton({ href, label }: { href?: string; label: string }) {
  const checkoutUrl = 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view';

  const handleClick = () => {
    PixelTracker.initiateCheckout(label, checkoutUrl);
  };

  const cleanLabel = (label || 'Register Now (33% off)').replace(/\s*→\s*$/, '');

  return (
    <a
      className="cta-btn"
      href={checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      <span>{cleanLabel}</span>
      <ArrowRightIcon />
    </a>
  );
}

function HeroSectionBlock({
  data,
  registerUrl,
}: {
  data: Record<string, any>;
  registerUrl?: string;
}) {
  const vid = asObj(data.video);
  const rawUrl = asStr(vid.url);
  const isOldDefault =
    !rawUrl ||
    rawUrl.includes('hero-fast.mp4') ||
    rawUrl.includes('hero-intro.mp4') ||
    rawUrl.includes('hero-optimized.mp4') ||
    rawUrl.includes('hero.mp4') ||
    rawUrl.includes('dQw4w9WgXcQ') ||
    rawUrl.includes('unsplash') ||
    rawUrl.includes('res.cloudinary.com/dldynfkhm');

  const videoObj = isOldDefault
    ? {
        source: 'wistia',
        url: DEFAULTS.HERO_VIDEO,
        poster: DEFAULTS.HERO_POSTER,
      }
    : {
        ...vid,
        poster: fallbackIfDead(asStr(vid.poster), DEFAULTS.HERO_POSTER),
      };

  return (
    <section className="hero container center" id="workshop">
      <div className="hero-brand-header">
        <img
          src="/ai-school-logo.webp?v=3"
          alt="AI School Raipur"
          className="hero-logo-img"
          width="320"
          height="106"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {asStr(data.eyebrow) ? (
        <a
          href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
          target="_blank"
          rel="noopener noreferrer"
          className="badge-pill badge-pill--link"
          onClick={() =>
            PixelTracker.initiateCheckout('Eyebrow Badge - Full Day Live AI Workshop', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
          }
        >
          <SectionIcon name="spark" size={14} />
          <span>{asStr(data.eyebrow).replace(/1000\+\s*people\s*attended\s*in\s*raipur/gi, 'Full Day Live AI Workshop').replace(/2000\+/g, 'Full Day Live AI Workshop')}</span>
        </a>
      ) : null}
      {asStr(data.heading) || asStr(data.highlight) || asStr(data.headingEnd) ? (
        <h1 className="heading heading--hero">
          <span className="heading-line">{asStr(data.heading, "Raipur's Biggest").replace("Raipur's Most Advanced", "Raipur's Biggest")}</span>
          <em className="heading-line">AI Workshop</em>
        </h1>
      ) : null}
      <div className="pill-row">
        {(() => {
          const arr = asArr(data.pills);
          const datePill = arr.find((p) => asStr(p.label).includes('November') || (asStr(p.icon) === 'calendar' && !asStr(p.label).includes('Sunday'))) || { icon: 'calendar', label: '29th November' };
          const dayPill = arr.find((p) => asStr(p.label).toLowerCase().includes('sunday')) || { icon: 'calendar', label: 'Sunday' };
          const timePill = arr.find((p) => asStr(p.label).includes('AM') || asStr(p.icon) === 'clock') || { icon: 'clock', label: '10:00 AM - 3:00 PM' };
          const locPill = arr.find((p) => asStr(p.label).includes('Vimtara') || asStr(p.icon) === 'pin') || { icon: 'pin', label: 'Vimtara Hall' };
          const list = [
            { icon: 'calendar', label: asStr(datePill.label, '29th November') },
            { icon: 'calendar', label: asStr(dayPill.label, 'Sunday') },
            { icon: 'clock', label: asStr(timePill.label, '10:00 AM - 3:00 PM') },
            { icon: 'pin', label: asStr(locPill.label).replace(', Raipur', '').trim() || 'Vimtara Hall' },
          ];
          return list.map((pill) => (
            <span key={pill.label} className="event-pill">
              <SectionIcon name={pill.icon} size={16} />
              {pill.label}
            </span>
          ));
        })()}
      </div>
      {asStr(asObj(data.primaryButton).label) ? (
        <div className="hero-cta">
          <CtaButton
            href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
            label="Register Now (33% off) →"
          />
        </div>
      ) : null}
      <div className="hero-video">
        <div className="video-frame">
          {videoObj ? (
            <VideoPlayer
              video={videoObj}
              title="Workshop preview"
              autoPlay
              muted={false}
              controls
              preload="metadata"
            />
          ) : null}
        </div>
      </div>
      <p className="seats hero-seats-top">
        <a
          href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
          target="_blank"
          rel="noopener noreferrer"
          className="seats-link"
          onClick={() =>
            PixelTracker.initiateCheckout('Seats Urgency - Under Video', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
          }
        >
          <span className="seats-highlight">⚡ 12 seats remaining, register now</span>
        </a>
      </p>
      {(asStr(data.originalPrice) || asStr(data.price)) && (
        <a
          href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
          target="_blank"
          rel="noopener noreferrer"
          className="price-pill price-pill--link"
          onClick={() =>
            PixelTracker.initiateCheckout('Price Pill - Hero', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
          }
        >
          <SectionIcon name="tag" size={16} />
          <s>{asStr(data.originalPrice, '₹2999')}</s>
          <span>Price {asStr(data.price, '₹1999 only')}</span>
        </a>
      )}
      <div className="hero-passes-row">
        <a
          href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-pass-chip hero-pass-chip--silver"
          onClick={() =>
            PixelTracker.initiateCheckout('Silver Pass Chip', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
          }
        >
          <SectionIcon name="ticket" size={14} />
          <span>Silver Pass</span>
        </a>
        <a
          href="https://rzp.io/rzp/b4ddaY2g"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-pass-chip hero-pass-chip--gold"
          onClick={() =>
            PixelTracker.initiateCheckout('Gold Pass Chip', 'https://rzp.io/rzp/b4ddaY2g')
          }
        >
          <SectionIcon name="spark" size={14} />
          <span>Gold Pass</span>
          <span className="hero-pass-chip__tag">Popular</span>
        </a>
        <a
          href="https://rzp.io/rzp/zTWDhdP"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-pass-chip hero-pass-chip--vip"
          onClick={() =>
            PixelTracker.initiateCheckout('VIP Pass Chip', 'https://rzp.io/rzp/zTWDhdP')
          }
        >
          <SectionIcon name="star" size={14} />
          <span>VIP Pass</span>
          <span className="hero-pass-chip__tag">VIP</span>
        </a>
      </div>
      <div className="hero-cta hero-cta--below-video">
        <CtaButton
          href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
          label="Register Now (33% off) →"
        />
      </div>
      {asStr(data.description) ? (
        <p className="lede lede--hero">{asStr(data.description)}</p>
      ) : null}
    </section>
  );
}

function StatCounter({
  target,
  prefix = '',
  suffix = '',
  inView,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) {
      setDisplayValue(0);
      return;
    }

    let startTimestamp: number | null = null;
    let animId: number;
    const duration = 1600;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(ease * target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [inView, target]);

  return <>{`${prefix}${displayValue.toLocaleString('en-IN')}${suffix}`}</>;
}

const CANONICAL_STATS = [
  { target: 10, prefix: '', suffix: ' Lakh+', label: 'Followers', text: '10 Lakh+' },
  { target: 25000, prefix: '', suffix: '+', label: 'Students', text: '25,000+' },
  { target: 500, prefix: '', suffix: '+', label: 'Trainings', text: '500+' },
  { target: 10, prefix: '', suffix: '+', label: 'Experience', text: '10+' },
];

function IconFeaturesBlock({ data }: { data?: Record<string, any> }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Guarantee user-specified statistics: 10,00,000+ Followers, 25,000+ Students, 10+ Years Experience, 45+ Workshops Taken
  const items = CANONICAL_STATS;

  return (
    <div ref={sectionRef} className="container stat-capsule-container">
      <div className="stat-capsule">
        {items.map((it, idx) => (
          <React.Fragment key={`${it.label}-${idx}`}>
            <div className="stat-capsule__item">
              <span className="stat-capsule__num">
                <StatCounter
                  target={it.target}
                  prefix={it.prefix}
                  suffix={it.suffix}
                  inView={inView}
                />
              </span>
              <span className="stat-capsule__label">{it.label}</span>
            </div>
            {idx < items.length - 1 && <div className="stat-capsule__divider" aria-hidden />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const DEFAULT_HOST_SLIDES = [
  {
    url: '/media/host-slide-2.jpg',
    alt: 'Lakshit Sethiya delivering keynote presentation on AI Systems',
    caption: 'Keynote Speaker • AI Systems',
    position: 'center 18%',
  },
  {
    url: '/media/host-slide-3.jpg',
    alt: 'Lakshit Sethiya hosting workshop keynote in Raipur',
    caption: 'Live Workshop Keynote',
    position: '65% 20%',
  },
  {
    url: '/media/host-slide-4.jpg',
    alt: 'Lakshit Sethiya with Ankur Warikoo at BBM 2025',
    caption: 'With Ankur Warikoo (BBM 2025)',
    position: 'center 15%',
  },
  {
    url: '/media/lakshit-with-vaibhav-sisinty.webp',
    alt: 'Lakshit Sethiya with Vaibhav Sisinty (GrowthSchool)',
    caption: 'With Vaibhav Sisinty (GrowthSchool)',
    position: 'center 15%',
  },
];

function InstructorBlock({ data }: { data: Record<string, any> }) {
  const rawPhotos = asArr(data.photos);
  const slides = (rawPhotos.length > 0 ? rawPhotos : DEFAULT_HOST_SLIDES).filter((s: any) => {
    const u = typeof s === 'string' ? s : s?.url || '';
    return !u.includes('host-slide-1');
  });

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const diff = e.changedTouches[0].clientX - touchStartXRef.current;
      if (diff > 45) {
        prevSlide();
      } else if (diff < -45) {
        nextSlide();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  const activeSlide = slides[current] || slides[0];

  return (
    <section className="section container instructor" id="instructor">
      <div
        className="instructor-card"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="instructor-slides-wrap">
          {slides.map((s, idx) => {
            const isActive = idx === current;
            const imgSrc = typeof s === 'string' ? s : s?.url || s;
            const imgAlt = (typeof s === 'object' && s?.alt) || asStr(data.name) || 'Lakshit Sethiya';
            const imgPos = (typeof s === 'object' && s?.position) || 'center 20%';
            return (
              <img
                key={imgSrc + idx}
                src={resolveAssetUrl(imgSrc)}
                alt={imgAlt}
                className={`instructor-slide-img ${isActive ? 'is-active' : ''}`}
                style={{
                  objectPosition: imgPos,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            );
          })}
        </div>

        {/* Carousel Arrow Controls */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="instructor-nav-btn instructor-nav-btn--prev"
              onClick={prevSlide}
              aria-label="Previous host photo"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              type="button"
              className="instructor-nav-btn instructor-nav-btn--next"
              onClick={nextSlide}
              aria-label="Next host photo"
            >
              <ChevronRightIcon size={18} />
            </button>

            {/* Indicator Dots */}
            <div className="instructor-dots" role="tablist" aria-label="Host photos">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`instructor-dot ${idx === current ? 'is-active' : ''}`}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Details */}
        <div className="instructor-meta">
          <div className="instructor-meta__top">
            <p className="eyebrow">{asStr(data.eyebrow) || 'YOUR INSTRUCTOR'}</p>
            {activeSlide?.caption && (
              <span className="instructor-slide-tag">{activeSlide.caption}</span>
            )}
          </div>
          <h2>{asStr(data.name) || 'Lakshit Sethiya'}</h2>
          <p className="muted">{asStr(data.title, 'AI & Automation Consultant').replace(/strategist/gi, 'Consultant')}</p>
        </div>
      </div>

      <p className="eyebrow speaker-label">{asStr(data.speakingLabel)}</p>
      <div className="logo-row">
        {asArr(data.logos).map((logo) => {
          const imgSrc = resolveSpeakerLogo(logo.label, logo.image);
          return (
            <div key={logo.label} className="logo-badge">
              {imgSrc ? (
                <img src={resolveAssetUrl(imgSrc)} alt={logo.label} loading="lazy" decoding="async" />
              ) : (
                <span>{String(logo.label || '').slice(0, 1)}</span>
              )}
              <p>{logo.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VideoGalleryBlock({
  data,
  seatsRemaining,
  registerUrl,
  registerLabel,
}: {
  data: Record<string, any>;
  seatsRemaining?: number;
  registerUrl?: string;
  registerLabel?: string;
}) {
  const [activeClip, setActiveClip] = useState<string | null>(null);

  // Lazy-load Wistia scripts only when the video section is mounted
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
      const s1 = document.createElement('script');
      s1.src = 'https://fast.wistia.com/player.js';
      s1.async = true;
      document.head.appendChild(s1);
    }
    if (!document.querySelector('script[src*="fast.wistia.com/embed/7lebzhc6xh.js"]')) {
      const s2 = document.createElement('script');
      s2.src = 'https://fast.wistia.com/embed/7lebzhc6xh.js';
      s2.async = true;
      s2.type = 'module';
      document.head.appendChild(s2);
    }
  }, []);

  const rawItems = asArr(data.items);
  const count = rawItems.length > 0 ? Math.max(rawItems.length, DEFAULTS.ATTENDEE_THUMBS.length) : 0;
  if (count === 0) return null;

  const paddedItems = Array.from({ length: count }, (_, idx) => rawItems[idx] || {}).slice(0, count);

  const renderPersonCard = (item: any, index: number) => {
    const thumb = resolveAttendeeThumb(index, asStr(item.image));
    const vidUrl = resolveAttendeeVideo(index, asStr(asObj(item.video).url));
    const clipKey = `clip-${index}`;
    const isPlaying = activeClip === clipKey;
    const name = asStr(item.name, `Attendee ${index + 1}`);

    return (
      <div key={clipKey} className="person-card">
        {isPlaying ? (
          <VideoPlayer
            video={{ url: vidUrl, poster: thumb }}
            title={name}
            autoPlay
            muted={false}
            controls
          />
        ) : (
          <button
            className="person-play"
            type="button"
            onClick={() => setActiveClip(clipKey)}
            aria-label={`Play ${name}`}
          >
            {thumb ? (
              <img
                src={resolveAssetUrl(thumb)}
                alt={name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (!el.dataset.triedFallback) {
                    el.dataset.triedFallback = '1';
                    el.src = resolveAssetUrl(DEFAULTS.ATTENDEE_THUMBS[index] || DEFAULTS.ATTENDEE_THUMBS[0]);
                  }
                }}
              />
            ) : null}
            <span className="play-badge">▶</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="section section--tight-end container center">
      {asStr(data.eyebrow) && !asStr(data.eyebrow).toLowerCase().includes('attendees share') ? (
        <p className="eyebrow">{asStr(data.eyebrow)}</p>
      ) : null}
      {asStr(data.heading) || asStr(data.highlight) ? (
        <h2 className="heading">
          {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
        </h2>
      ) : null}
      <div className="wistia-featured-video-wrap">
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <wistia-player
                media-id="7lebzhc6xh"
                aspect="1.7777777777777777"
                big-play-button="true"
                play-bar-control="false"
                controls-visible-on-load="false"
                play-pause-control="false"
                volume-control="false"
                fullscreen-control="false"
                playback-rate-control="false"
                settings-control="false"
              ></wistia-player>
            `,
          }}
        />
      </div>
      {asStr(data.description) && !asStr(data.description).toLowerCase().includes('actual attendees') ? (
        <p className="lede">{asStr(data.description)}</p>
      ) : null}
      <div className="people-row">
        {paddedItems.map((it, i) => renderPersonCard(it, i))}
      </div>
      {typeof seatsRemaining === 'number' ? (
        <p className="seats">Only {(seatsRemaining && seatsRemaining !== 60 && seatsRemaining !== 127 ? seatsRemaining : 12)} seats remaining. Register now!</p>
      ) : null}
      {registerLabel ? (
        <div className="hero-cta">
          <CtaButton href={resolveCtaHref(undefined, registerUrl)} label={registerLabel} />
        </div>
      ) : null}
    </section>
  );
}

export function PassesBlock({
  data,
  seatsRemaining = 12,
}: {
  data?: Record<string, any>;
  seatsRemaining?: number;
}) {
  const d = data || {};
  const safeSeats =
    seatsRemaining && seatsRemaining !== 60 && seatsRemaining !== 127 ? seatsRemaining : 12;
  const eyebrow = asStr(d.eyebrow, 'CHOOSE YOUR PASS');
  const heading = asStr(d.heading, 'Select Your Workshop Pass for');
  const highlight = asStr(d.highlight, '29th November');
  const headingEnd = asStr(d.headingEnd, '');
  const description =
    asStr(d.description) ||
    "Raipur's Most Advanced AI & Automation Workshop by Lakshit Sethiya · Vimtara Hall, Raipur (10:00 AM TO 03:00 PM)";
  const seatsText =
    (asStr(d.seatsText) ? asStr(d.seatsText).replace(/(?:60|127)\s*seats/gi, '12 seats') : '') ||
    `Only ${safeSeats} seats remaining. Early discounted seats are filling fast!`;

  return (
    <section className="section container passes-section tickets-section" id="passes">
      <div id="register" style={{ position: 'relative', top: '-75px', visibility: 'hidden', height: 0, margin: 0, padding: 0 }} />
      <div id="tickets" style={{ position: 'relative', top: '-75px', visibility: 'hidden', height: 0, margin: 0, padding: 0 }} />
      <div className="center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="heading">
          <a
            href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
            target="_blank"
            rel="noopener noreferrer"
            className="heading-link-checkout"
            onClick={() =>
              PixelTracker.initiateCheckout('Select Your Workshop Pass Heading', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
            }
          >
            {heading} {highlight ? <em>{highlight}</em> : null} {headingEnd}
          </a>
        </h2>
        {description ? <p className="lede lede--tickets lede--passes">{description}</p> : null}
        {seatsText ? (
          <a
            href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
            target="_blank"
            rel="noopener noreferrer"
            className="tickets-urgency-pill passes-urgency-pill tickets-urgency-pill--link"
            onClick={() =>
              PixelTracker.initiateCheckout('Urgency Pill - Passes', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
            }
          >
            <span className="tickets-urgency-dot" />
            <span>{seatsText}</span>
          </a>
        ) : null}
      </div>

      <div className="passes-grid tickets-grid">
        {WORKSHOP_PASSES.map((pass) => {
          const isGold = pass.id === 'gold';
          const isVip = pass.id === 'vip';
          const cardClass = [
            'pass-card',
            'ticket-card',
            isGold ? 'pass-card--popular ticket-card--popular' : '',
            isVip ? 'pass-card--vip ticket-card--vip' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={pass.id} className={cardClass}>
              {pass.badge ? (
                <div
                  className={`pass-badge ticket-badge ${
                    isVip ? 'pass-badge--vip ticket-badge--vip' : 'pass-badge--popular ticket-badge--popular'
                  }`}
                >
                  {pass.badge}
                </div>
              ) : (
                <div className="pass-badge-placeholder ticket-badge-placeholder" />
              )}

              <div className="pass-header ticket-header">
                <h3 className="pass-name ticket-name">
                  <a
                    href={pass.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pass-name-link"
                    onClick={() =>
                      PixelTracker.initiateCheckout(pass.name, pass.url, { name: pass.name, price: pass.price })
                    }
                  >
                    {pass.name}
                  </a>
                </h3>
                <div className="pass-pricing ticket-pricing">
                  <div className="pass-price-row ticket-price-row">
                    <span className="pass-currency ticket-currency">₹</span>
                    <span className="pass-price ticket-price">{pass.price.toLocaleString('en-IN')}</span>
                    {pass.originalPrice ? (
                      <s className="pass-original-price ticket-original-price">
                        ₹{pass.originalPrice.toLocaleString('en-IN')}
                      </s>
                    ) : null}
                  </div>
                  <div className="pass-discount-tag ticket-discount-tag">
                    <a
                      href={pass.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pass-discount-tag--link"
                      onClick={() =>
                        PixelTracker.initiateCheckout(pass.discountText, pass.url)
                      }
                    >
                      {pass.discountText}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pass-divider ticket-divider" />

              <ul className="pass-features ticket-features">
                {pass.features.map((feat, i) => (
                  <li
                    key={i}
                    className={`pass-feature ticket-feature ${
                      feat.highlight ? 'pass-feature--highlight ticket-feature--highlight' : ''
                    }`}
                  >
                    <span className="pass-feature-icon ticket-feature-icon" aria-hidden>
                      ✓
                    </span>
                    <span className="pass-feature-text ticket-feature-text">
                      {feat.text.includes('Early Discounted Seats') ? (
                        <a
                          href={pass.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="feature-highlight-link"
                          onClick={() =>
                            PixelTracker.initiateCheckout(feat.text, pass.url)
                          }
                        >
                          {feat.text}
                        </a>
                      ) : (
                        feat.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pass-action ticket-action">
                <a
                  href={pass.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pass-btn ticket-btn ${
                    isVip
                      ? 'pass-btn--vip ticket-btn--vip'
                      : isGold
                      ? 'pass-btn--popular ticket-btn--popular'
                      : 'pass-btn--silver ticket-btn--silver'
                  }`}
                  onClick={() =>
                    PixelTracker.initiateCheckout(
                      `Register Now - ${pass.name}`,
                      pass.url,
                      { name: pass.name, price: pass.price }
                    )
                  }
                >
                  Register Now →
                </a>
                <span className="pass-secure-hint ticket-secure-hint">
                  Instant Confirmation via WhatsApp & Email
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="passes-footer-note tickets-footer-note">
        <p className="muted">
          🔒 <strong>100% Secure Payment</strong> powered by Razorpay · UPI, Cards, NetBanking accepted
        </p>
      </div>
    </section>
  );
}

export const TicketsBlock = PassesBlock;

export function PassModal({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const checkHash = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#passes' || hash === '#tickets' || hash === '#register' || hash === '#cta') {
        setIsOpen(true);
      }
    };

    window.addEventListener('open-pass-modal', handleOpen);
    window.addEventListener('close-pass-modal', handleClose);
    window.addEventListener('hashchange', checkHash);
    checkHash();

    return () => {
      window.removeEventListener('open-pass-modal', handleOpen);
      window.removeEventListener('close-pass-modal', handleClose);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePassSelect = (pass: WorkshopPass) => {
    PixelTracker.initiateCheckout(pass.name, pass.url);
    window.open(pass.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="pass-modal-backdrop"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pass-modal-title"
    >
      <div
        className="pass-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="pass-modal-close"
          aria-label="Close modal"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className="pass-modal-header">
          <h2 id="pass-modal-title" className="pass-modal-title">
            Select Your Workshop Pass
          </h2>
        </div>

        <div className="pass-modal-grid">
          {WORKSHOP_PASSES.map((pass) => {
            const isGold = pass.id === 'gold';
            const isVip = pass.id === 'vip';
            return (
              <div
                key={pass.id}
                className={`modal-pass-card ${isGold ? 'modal-pass-card--popular' : ''} ${
                  isVip ? 'modal-pass-card--vip' : ''
                }`}
              >
                {pass.badge ? (
                  <div
                    className={`modal-pass-badge ${
                      isVip ? 'modal-pass-badge--vip' : 'modal-pass-badge--popular'
                    }`}
                  >
                    {pass.badge}
                  </div>
                ) : (
                  <div className="modal-pass-badge-placeholder" />
                )}

                <div className="modal-pass-head">
                  <h3 className="modal-pass-name">
                    <a
                      href={pass.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pass-name-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        PixelTracker.initiateCheckout(pass.name, pass.url, { name: pass.name, price: pass.price });
                      }}
                    >
                      {pass.name}
                    </a>
                  </h3>
                  <div className="modal-pass-pricing">
                    <div className="modal-pass-price-row">
                      <span className="modal-pass-currency">₹</span>
                      <span className="modal-pass-price">{pass.price.toLocaleString('en-IN')}</span>
                      {pass.originalPrice ? (
                        <s className="modal-pass-original-price">
                          ₹{pass.originalPrice.toLocaleString('en-IN')}
                        </s>
                      ) : null}
                    </div>
                    <div className="modal-pass-discount-tag">
                      <a
                        href={pass.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pass-discount-tag--link"
                        onClick={(e) => {
                          e.stopPropagation();
                          PixelTracker.initiateCheckout(pass.discountText, pass.url);
                        }}
                      >
                        {pass.discountText}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="modal-pass-divider" />

                <ul className="modal-pass-features">
                  {pass.features.map((feat, i) => (
                    <li
                      key={i}
                      className={`modal-pass-feature ${
                        feat.highlight ? 'modal-pass-feature--highlight' : ''
                      }`}
                    >
                      <span className="modal-pass-check" aria-hidden>
                        ✓
                      </span>
                      <span>
                        {feat.text.includes('Early Discounted Seats') ? (
                          <a
                            href={pass.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="feature-highlight-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              PixelTracker.initiateCheckout(feat.text, pass.url);
                            }}
                          >
                            {feat.text}
                          </a>
                        ) : (
                          feat.text
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`modal-pass-btn ${
                    isVip
                      ? 'modal-pass-btn--vip'
                      : isGold
                      ? 'modal-pass-btn--popular'
                      : 'modal-pass-btn--silver'
                  }`}
                  onClick={() => handlePassSelect(pass)}
                >
                  <span>Register Now →</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="pass-modal-footer">
          <p>
            🔒 <strong>100% Secure Payment</strong> powered by Razorpay · UPI, Cards, NetBanking accepted
          </p>
        </div>
      </div>
    </div>
  );
}

function CtaSectionBlock({
  data,
  registerUrl,
  registerLabel,
}: {
  data: Record<string, any>;
  registerUrl?: string;
  registerLabel?: string;
}) {
  const btn = asObj(data.button);
  const label = asStr(btn.label) || asStr(registerLabel, 'Register Now →');
  if (
    !hasAnyStr(
      data.heading,
      data.highlight,
      data.headingEnd,
      data.description,
      data.seatsText,
      data.note
    ) &&
    !label
  ) {
    return null;
  }

  return (
    <section className="section container cta-section-wrap" id="cta-block">
      <div className="cta-card">
        {asStr(data.heading) || asStr(data.highlight) || asStr(data.headingEnd) ? (
          <h2 className="heading" style={{ fontSize: '2.4rem' }}>
            {asStr(data.heading)} <em>{asStr(data.highlight)}</em> {asStr(data.headingEnd)}
          </h2>
        ) : null}
        {asStr(data.description) ? <p className="lede">{asStr(data.description)}</p> : null}
        {asStr(data.seatsText) ? (
          <p className="seats">
            <a
              href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
              target="_blank"
              rel="noopener noreferrer"
              className="seats-link"
              onClick={() =>
                PixelTracker.initiateCheckout('Seats Text - CTA', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
              }
            >
              {asStr(data.seatsText).replace(/(?:60|127)\s*seats/gi, '12 seats')}
            </a>
          </p>
        ) : null}
        {label ? <CtaButton href={resolveCtaHref(asStr(btn.url), registerUrl)} label={label} /> : null}
        {asStr(data.note) ? (
          <p className="muted" style={{ marginTop: '1rem' }}>
            {asStr(data.note)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ProofImpactBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="section section--tight-start container center" id="proof">
      <p className="eyebrow">{asStr(data.eyebrow)}</p>
      <h2 className="heading">
        {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
      </h2>
      <p className="lede">{asStr(data.description)}</p>
      <div className="proof-grid">
        {asArr(data.images).map((img, i) => {
          const rawUrl = asStr(img.url);
          const fallbackUrl = '/media/proof-youtube.webp';
          const srcUrl = rawUrl ? resolveAssetUrl(rawUrl) : fallbackUrl;
          return (
            <div key={`${srcUrl}-${i}`} className="proof-frame">
              <img
                src={srcUrl}
                alt={img.alt || 'Proof of impact'}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith(fallbackUrl)) {
                    target.src = fallbackUrl;
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkshopTracksBlock({ data }: { data: Record<string, any> }) {
  const tracks = asArr(data.tracks ?? data.items);
  return (
    <section className="section container center" id="tracks">
      <p className="eyebrow">{asStr(data.eyebrow)}</p>
      <h2 className="heading">
        {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
      </h2>
      <p className="lede">{asStr(data.description)}</p>
      <div className="grid-tracks">
        {tracks.map((tr) => {
          const img = resolveTrackImage(tr.title, tr.image);
          return (
            <article key={tr.title} className="track-card">
              <div className="track-visual">
                {img ? <img src={resolveAssetUrl(img)} alt={tr.title} loading="lazy" decoding="async" /> : null}
              </div>
              <div className="icon-dot" aria-hidden>
                <SectionIcon name={resolveTrackIcon(tr.title, tr.icon)} size={16} />
              </div>
              <h3>{tr.title}</h3>
              <p>{tr.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TopicIcon({ name }: { name: string }) {
  switch (name) {
    case 'prompting':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      );
    case 'content_creation':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    case 'designing':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 9 9 9 1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.6 0-1.1.9-2 2-2h1.5c3.6 0 6.5-2.9 6.5-6.5C22 6 17.5 2 12 2z" />
          <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" />
          <circle cx="11" cy="7.5" r="1.2" fill="currentColor" />
          <circle cx="15.5" cy="9.5" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'video_editing':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
      );
    case 'video_making':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="3" ry="3" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'calling':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'agents':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4" y="8" width="16" height="12" rx="3" />
          <circle cx="9" cy="13" r="1.5" fill="currentColor" />
          <circle cx="15" cy="13" r="1.5" fill="currentColor" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <circle cx="12" cy="2" r="1" fill="currentColor" />
          <line x1="2" y1="14" x2="4" y2="14" />
          <line x1="20" y1="14" x2="22" y2="14" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" />
        </svg>
      );
    case 'lead_gen':
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
  }
}

const TOPIC_SHOWCASE_ITEMS = [
  { num: '01', title: 'Prompting', icon: 'prompting' },
  { num: '02', title: 'Content Creation', icon: 'content_creation' },
  { num: '03', title: 'Designing', icon: 'designing' },
  { num: '04', title: 'Video Editing', icon: 'video_editing' },
  { num: '05', title: 'Video Making', icon: 'video_making' },
  { num: '06', title: 'WhatsApp Automation', icon: 'whatsapp' },
  { num: '07', title: 'AI Calling', icon: 'calling' },
  { num: '08', title: 'AI Agents', icon: 'agents' },
  { num: '09', title: 'Instagram Automation', icon: 'instagram' },
  { num: '10', title: 'Lead Generation', icon: 'lead_gen' },
];

function WhatYouLearnBlock({ data }: { data?: Record<string, any> }) {
  const eyebrow = asStr(data?.eyebrow) || 'WORKSHOP ROADMAP';
  const headingLine1 = asStr(data?.headingLine1) || '10 AI skills.';
  const headingLine2 = asStr(data?.headingLine2) || 'One power-packed day.';

  return (
    <section className="section container topics-showcase-section" id="curriculum">
      <div className="center">
        <div className="topics-pill">
          <span className="topics-pill__dot" aria-hidden />
          <span>{eyebrow}</span>
        </div>
        <h2 className="topics-heading">
          <span className="topics-heading__line1">{headingLine1}</span>
          <span className="topics-heading__line2">{headingLine2}</span>
        </h2>
      </div>

      {/* 5-Column Grid */}
      <div className="topics-grid-5col">
        {TOPIC_SHOWCASE_ITEMS.map((item) => (
          <div key={item.num} className="topic-card">
            <div className="topic-card__top">
              <div className="topic-card__icon-box" aria-hidden>
                <TopicIcon name={item.icon} />
              </div>
              <span className="topic-card__num">{item.num}</span>
            </div>
            <h3 className="topic-card__title">{item.title}</h3>
          </div>
        ))}
      </div>

      {/* Footer Info & Action Bar */}
      <div className="topics-footer-bar">
        <div className="topics-footer-meta">
          <div className="topics-meta-item">
            <CalendarIcon size={16} />
            <span>29 Nov</span>
          </div>
          <div className="topics-meta-item">
            <ClockIcon size={16} />
            <span>10 AM – 3 PM</span>
          </div>
          <div className="topics-meta-item">
            <MapPinIcon size={16} />
            <span>Vimtara Hall, Raipur</span>
          </div>
          <div className="topics-meta-item">
            <UtensilsIcon size={16} />
            <span>Lunch included</span>
          </div>
        </div>

        <a
          href="https://pages.razorpay.com/pl_TssC8YodCsa06i/view"
          target="_blank"
          rel="noopener noreferrer"
          className="topics-reserve-btn"
          onClick={() =>
            PixelTracker.initiateCheckout('Reserve my seat - Curriculum', 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view')
          }
        >
          <span>Reserve my seat</span>
          <span className="topics-reserve-btn__arrow" aria-hidden>
            <ArrowRightIcon size={14} />
          </span>
        </a>
      </div>
    </section>
  );
}

export function EventTimelineBlock({ data }: { data?: Record<string, any> }) {
  const d = data || {};
  const heading = asStr(d.heading, 'Event');
  const highlight = asStr(d.highlight, 'Timeline');
  const description =
    asStr(d.description) ||
    'A carefully structured, power-packed day designed to take you from foundational AI prompting to automated enterprise workflows.';
  const rawItems = asArr(d.items);
  const items = rawItems.map((item) => {
    const time = asStr(item.time);
    const title = asStr(item.title);
    const isGoldVip = time.includes('3:00 PM') || time.includes('5:00 PM') || title.toLowerCase().includes('doubt session') || title.toLowerCase().includes('end of the event');
    if (isGoldVip) {
      return {
        ...item,
        badge: item.badge || 'GOLD & VIP PASSES ONLY',
        highlight: true,
      };
    }
    return item;
  });
  const cta = asObj(d.cta);
  const ctaLabel = asStr(cta.label, 'Reserve Your Seat Now →');
  const ctaUrl = asStr(cta.url, 'https://pages.razorpay.com/pl_TssC8YodCsa06i/view');

  return (
    <section className="section container timeline-section" id="timeline">
      <div className="center">
        <h2 className="heading">
          {heading} <em>{highlight}</em>
        </h2>
        {description ? <p className="lede timeline-lede">{description}</p> : null}
      </div>

      <div className="timeline-wrap">
        <div className="timeline-track-line" aria-hidden />
        <div className="timeline-list">
          {items.map((item, idx) => {
            const isHighlight = Boolean(item.highlight);
            const badge = asStr(item.badge);
            return (
              <div
                key={idx}
                className={`timeline-item ${isHighlight ? 'timeline-item--highlight' : ''}`}
              >
                <div className="timeline-marker">
                  <div className="timeline-marker-dot">
                    <SectionIcon name={item.icon || 'clock'} size={14} />
                  </div>
                </div>

                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="timeline-time-pill">
                      <ClockIcon />
                      <span>{item.time}</span>
                    </div>
                    {badge ? (
                      <span className="timeline-badge">
                        {item.icon === 'utensils' ? <UtensilsIcon size={12} /> : null}
                        {badge}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="timeline-title">{item.title}</h3>
                  {item.description ? (
                    <p className="timeline-desc">{item.description}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="center timeline-footer-cta">
        <CtaButton
          href={ctaUrl}
          label={ctaLabel}
        />
      </div>
    </section>
  );
}

function AudienceBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="section container">
      <div className="audience-box">
        <div className="audience-copy">
          <p className="eyebrow">{asStr(data.eyebrow)}</p>
          <h2 className="heading" style={{ fontSize: '2.4rem' }}>
            {asStr(data.heading)}
          </h2>
          <p className="lede" style={{ marginLeft: 0 }}>
            {asStr(data.description)}
          </p>
        </div>
        <div className="check-grid">
          {asArr(data.items).map((item) => (
            <div key={item.label} className="check-item">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoGalleryBlock({ data }: { data: Record<string, any> }) {
  const rawCategories = asArr(data.categories);
  const categories = [...rawCategories].sort((a, b) => {
    const tA = String(a?.title || '').toUpperCase();
    const tB = String(b?.title || '').toUpperCase();
    const getOrder = (t: string) => {
      if (t.includes('CHIEF MINISTER')) return 0;
      if (t.includes('ACHIEVEMENT') || t.includes('AWARD')) return 1;
      if (t.includes('WORKSHOP PLACE')) return 2;
      if (t.includes('SHARING STAGE')) return 3;
      if (t.includes('OFFLINE WORKSHOPS')) return 4;
      if (t.includes('OFFLINE MEETUPS')) return 5;
      return 10;
    };
    return getOrder(tA) - getOrder(tB);
  });

  return (
    <section className="section container" id="gallery" style={{ paddingBottom: 0 }}>
      <div className="center">
        <p className="eyebrow">{asStr(data.eyebrow)}</p>
        <h2 className="heading">
          {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
        </h2>
      </div>
      {categories.map((cat) => {
        const title = asStr(cat.title);
        const images = asArr(cat.images);
        const isSingle = images.length === 1;
        const isAchievement =
          (title.toUpperCase().includes('ACHIEVEMENT') || title.toUpperCase().includes('AWARD')) &&
          !title.toUpperCase().includes('CHIEF MINISTER');

        if (isSingle) {
          return (
            <div key={title} className="gallery-category-wrap">
              <div className="rule-title">{title}</div>
              <div className="gallery-grid single gallery-grid--single">
                <div className="gallery-img-wrapper gallery-img-wrapper--single">
                  <img
                    src={resolveAssetUrl(resolveGalleryImage(title, 0, images[0]?.url))}
                    alt={images[0]?.alt || title}
                    className="gallery-freeform-img gallery-freeform-img--single"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (!el.dataset.triedFallback) {
                        el.dataset.triedFallback = '1';
                        el.src = resolveAssetUrl(resolveGalleryImage(title, 0, undefined));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }

        if (isAchievement) {
          const trophies = images.slice(0, 3);
          const stageAwards = images.slice(3);
          return (
            <div key={title} className="gallery-category-wrap">
              <div className="rule-title">{title}</div>
              {/* Row 1: 3 Trophies in a balanced row */}
              <div className="gallery-grid gallery-grid--trophies">
                {trophies.map((img, idx) => (
                  <div key={`${title}-trophy-${idx}`} className="gallery-img-wrapper">
                    <img
                      src={resolveAssetUrl(resolveGalleryImage(title, idx, img.url))}
                      alt={img.alt || title}
                      className="gallery-freeform-img gallery-img--trophy"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const el = e.currentTarget;
                        if (!el.dataset.triedFallback) {
                          el.dataset.triedFallback = '1';
                          el.src = resolveAssetUrl(resolveGalleryImage(title, idx, undefined));
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Row 2: Horizontal awards (max 2 per row with matching width and height) */}
              {stageAwards.length > 0 && (
                <div className="gallery-grid gallery-grid--horizontal landscape" style={{ marginTop: '1.5rem' }}>
                  {stageAwards.map((img, idx) => (
                    <div key={`${title}-stage-${idx}`} className="gallery-img-wrapper">
                      <img
                        src={resolveAssetUrl(resolveGalleryImage(title, idx + 3, img.url))}
                        alt={img.alt || title}
                        className="gallery-freeform-img gallery-img--horizontal"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (!el.dataset.triedFallback) {
                            el.dataset.triedFallback = '1';
                            el.src = resolveAssetUrl(resolveGalleryImage(title, idx + 3, undefined));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        const isPortrait = asStr(cat.layout) === 'portrait';
        const layoutClass = isPortrait ? 'portrait' : 'landscape gallery-grid--horizontal';
        const imgClass = isPortrait ? 'gallery-img--portrait' : 'gallery-img--horizontal';

        return (
          <div key={title} className="gallery-category-wrap">
            <div className="rule-title">{title}</div>
            <div className={`gallery-grid ${layoutClass}`}>
              {images.map((img, idx) => (
                <div key={`${title}-${idx}`} className="gallery-img-wrapper">
                  <img
                    src={resolveAssetUrl(resolveGalleryImage(title, idx, img.url))}
                    alt={img.alt || title}
                    className={`gallery-freeform-img ${imgClass}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (!el.dataset.triedFallback) {
                        el.dataset.triedFallback = '1';
                        el.src = resolveAssetUrl(resolveGalleryImage(title, idx, undefined));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function TeamBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="section container team-section" style={{ paddingTop: 0 }}>
      <div className="rule-title" style={{ marginTop: '2.2rem' }}>{asStr(data.heading)}</div>
      <div className="grid-2 team-grid">
        {asArr(data.images).map((img, idx) => (
          <div key={`${img.alt}-${idx}`} className="team-frame">
            <img
              src={resolveAssetUrl(resolveTeamImage(idx, img.url))}
              alt={img.alt || 'Team'}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MediaCoverageBlock({ data }: { data: Record<string, any> }) {
  const clippings = asArr(data.clippings);
  if (!clippings.length) return null;
  const limited = clippings.slice(0, DEFAULTS.MEDIA_CLIP_COUNT);

  return (
    <section className="section container center">
      <p className="eyebrow">{asStr(data.eyebrow)}</p>
      <h2 className="heading">
        {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
      </h2>
      <p className="lede">{asStr(data.description)}</p>
      <div className="clip-mosaic">
        {limited.map((clip, idx) => (
          <div key={`${clip.url}-${idx}`} className="clip-card">
            <img
              src={resolveAssetUrl(resolveMediaClipping(idx, clip.url))}
              alt={clip.alt || `Newspaper coverage ${idx + 1}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget;
                if (!el.dataset.triedFallback) {
                  el.dataset.triedFallback = '1';
                  el.src = `/media-coverage/img${(idx % 3) + 1}.webp`;
                }
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatsappFeedbackBlock({ data }: { data: Record<string, any> }) {
  const messages = asArr(data.messages);
  if (!messages.length) return null;
  const eyebrow = asStr(data.eyebrow);
  const showEyebrow = eyebrow && !eyebrow.toLowerCase().includes('straight from attendees');
  const description = asStr(data.description);
  const showDescription = description && !description.toLowerCase().includes('screenshots and messages') && !description.toLowerCase().includes('real feedback');

  return (
    <section className="section container center">
      {showEyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="heading">
        {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
      </h2>
      {showDescription ? <p className="lede">{description}</p> : null}
      <div className="phones" style={{ marginTop: '1.5rem' }}>
        {messages.map((msg, idx) => (
          <div key={msg.name || String(idx)} className="phone">
            <img
              src={resolveAssetUrl(resolveWhatsappScreenshot(idx, msg.screenshot))}
              alt={msg.name || `WhatsApp feedback ${idx + 1}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget;
                if (!el.dataset.triedFallback) {
                  el.dataset.triedFallback = '1';
                  el.src = `/whatsapp-feedback/img${(idx % 4) + 1}.webp`;
                }
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSectionBlock({
  data,
  faqs,
}: {
  data: Record<string, any>;
  faqs: FaqItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (!faqs.length) return null;

  return (
    <section className="section container center" id="faq">
      <p className="eyebrow">{asStr(data.eyebrow, 'FAQ')}</p>
      <h2 className="heading">{asStr(data.heading, 'Common questions')}</h2>
      <div className="faq-list">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className={`faq-block ${isOpen ? 'is-open' : ''}`}>
              <button
                className="faq-item"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <span>{faq.question}</span>
                <span className="faq-chevron">
                  <ChevronDownIcon />
                </span>
              </button>
              {isOpen ? <p className="faq-answer">{faq.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ContactFormBlock({
  data,
  sourcePage,
  onSubmit,
  status,
}: {
  data: Record<string, any>;
  sourcePage: string;
  onSubmit: (lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    sourcePage: string;
  }) => void;
  status: 'idle' | 'saving' | 'success' | 'error';
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message: String(fd.get('message') || ''),
      sourcePage,
    });
    e.currentTarget.reset();
  };

  return (
    <section className="section container center" id="contact">
      <h2 className="heading">{asStr(data.heading, 'Reserve your seat')}</h2>
      <p className="lede">{asStr(data.description)}</p>
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" required placeholder="Full name" />
        <input name="email" type="email" required placeholder="Email" />
        <input name="phone" placeholder="Phone" />
        <textarea name="message" rows={3} placeholder="Message" />
        <button className="cta-btn" type="submit" disabled={status === 'saving'}>
          {asStr(data.submitLabel, 'Register Now →')}
        </button>
        {status === 'success' ? (
          <p className="seats">{asStr(data.successMessage, 'Thanks — we will contact you shortly.')}</p>
        ) : null}
        {status === 'error' ? (
          <p className="seats">Could not submit. Please try again.</p>
        ) : null}
      </form>
    </section>
  );
}

function isSectionEmpty(
  section: PageSection,
  related: { courses: CourseItem[]; testimonials: TestimonialItem[]; faqs: FaqItem[] }
): boolean {
  const d = section.data || {};
  switch (section.type) {
    case 'spacer':
      return false;
    case 'hero':
      return (
        !hasAnyStr(
          d.eyebrow,
          d.heading,
          d.highlight,
          d.headingEnd,
          d.description,
          d.seatsText,
          d.originalPrice,
          d.price
        ) &&
        !hasAnyArr(d.pills) &&
        !trimStr(asObj(d.video).url) &&
        !trimStr(asObj(d.primaryButton).label)
      );
    case 'passes':
    case 'tickets':
    case 'proof_impact':
    case 'contact_form':
    case 'workshop_tracks':
    case 'features':
      return true;
    case 'what_you_learn':
      return false;
    case 'event_timeline':
      return !hasAnyStr(d.heading, d.highlight, d.eyebrow) && !hasAnyArr(d.items);
    case 'cta':
      return (
        !hasAnyStr(d.heading, d.highlight, d.headingEnd, d.description, d.seatsText, d.note) &&
        !trimStr(asObj(d.button).label)
      );
    case 'icon_features':
      return !hasAnyArr(d.items);
    case 'instructor':
      return !hasAnyStr(d.name, d.title, d.eyebrow, d.speakingLabel, d.photo) && !hasAnyArr(d.logos);
    case 'video_gallery':
      return !hasAnyStr(d.eyebrow, d.heading, d.highlight, d.description) && !hasAnyArr(d.items);


    case 'audience':
      return !hasAnyStr(d.eyebrow, d.heading, d.description) && !hasAnyArr(d.items);
    case 'photo_gallery': {
      const cats = asArr(d.categories);
      return !hasAnyStr(d.eyebrow, d.heading, d.highlight) && !cats.some((c) => hasAnyArr(c.images));
    }
    case 'team':
      return !trimStr(d.heading) && !hasAnyArr(d.images);
    case 'media_coverage':
      return !hasAnyStr(d.eyebrow, d.heading, d.highlight, d.description) && !hasAnyArr(d.clippings);
    case 'whatsapp_feedback':
      return !hasAnyStr(d.eyebrow, d.heading, d.highlight, d.description) && !hasAnyArr(d.messages);
    case 'faq':
      return related.faqs.length === 0;
    case 'image_text':
      return (
        !hasAnyStr(d.heading, d.body) &&
        !trimStr(asObj(d.image).url) &&
        !trimStr(asObj(d.button).label)
      );
    default:
      return false;
  }
}

export function SectionRenderer({
  section,
  theme,
  related,
  sourcePage,
  seatsRemaining,
  registerUrl,
  registerLabel,
  onLeadSubmit,
  leadStatus,
}: {
  section: PageSection;
  theme: string;
  related: { courses: CourseItem[]; testimonials: TestimonialItem[]; faqs: FaqItem[] };
  sourcePage: string;
  seatsRemaining?: number;
  registerUrl?: string;
  registerLabel?: string;
  onLeadSubmit: (lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    sourcePage: string;
  }) => void;
  leadStatus: 'idle' | 'saving' | 'success' | 'error';
}) {
  if (isSectionEmpty(section, related)) return null;

  let content: React.ReactNode = null;
  switch (section.type) {
    case 'hero':
      content = <HeroSectionBlock data={section.data} registerUrl={registerUrl} />;
      break;
    case 'icon_features':
      content = <IconFeaturesBlock data={section.data} />;
      break;
    case 'instructor':
      content = <InstructorBlock data={section.data} />;
      break;
    case 'video_gallery':
      content = (
        <VideoGalleryBlock
          data={section.data}
          seatsRemaining={seatsRemaining}
          registerUrl={registerUrl}
          registerLabel={registerLabel}
        />
      );
      break;
    case 'passes':
    case 'tickets':
    case 'proof_impact':
    case 'contact':
    case 'contact_form':
    case 'workshop_tracks':
    case 'features':
      return null;
    case 'what_you_learn':
      content = <WhatYouLearnBlock data={section.data} />;
      break;
    case 'event_timeline':
      content = <EventTimelineBlock data={section.data} />;
      break;
    case 'cta':
      if (section.id === 'cmtjtmwfc000mb5xsgxdv7yto' || section.id === 'cmtjtmwds000ab5xs1kl3b89i') {
        return null;
      }
      content = (
        <CtaSectionBlock
          data={section.data}
          registerUrl={registerUrl}
          registerLabel={registerLabel}
        />
      );
      break;


    case 'audience':
      content = <AudienceBlock data={section.data} />;
      break;
    case 'photo_gallery':
      content = <PhotoGalleryBlock data={section.data} />;
      break;
    case 'team':
      content = <TeamBlock data={section.data} />;
      break;
    case 'media_coverage':
      content = <MediaCoverageBlock data={section.data} />;
      break;
    case 'whatsapp_feedback':
      content = <WhatsappFeedbackBlock data={section.data} />;
      break;
    case 'faq':
      content = <FaqSectionBlock data={section.data} faqs={related.faqs} />;
      break;

    case 'spacer':
      content = <div style={{ height: Number(section.data.height || 48) }} />;
      break;
    default:
      content = null;
  }

  return content ? <div className={`theme-${theme || 'classic'}`}>{content}</div> : null;
}
