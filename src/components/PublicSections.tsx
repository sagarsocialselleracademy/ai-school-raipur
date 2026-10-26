import React, { useEffect, useRef, useState } from 'react';
import {
  CourseItem,
  DEFAULTS,
  FaqItem,
  NavItem,
  PageSection,
  SiteSettings,
  TestimonialItem,
} from '@/lib/data';
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

const HASH_TARGETS = new Set(['', '#', '#register', '#contact', '#cta']);

function isHashPlaceholder(url?: string): boolean {
  return HASH_TARGETS.has((url || '').trim().toLowerCase());
}

export function resolveButtonHref(url?: string, fallback = '#register'): string {
  const trimmed = (url || '').trim();
  return trimmed || fallback.trim() || '#register';
}

export function resolveCtaHref(primaryUrl?: string, globalRegisterUrl?: string): string {
  const globalTrimmed = (globalRegisterUrl || '').trim();
  if (globalTrimmed && !isHashPlaceholder(globalTrimmed)) return globalTrimmed;
  const primaryTrimmed = (primaryUrl || '').trim();
  if (primaryTrimmed && !isHashPlaceholder(primaryTrimmed)) return primaryTrimmed;
  return globalTrimmed || primaryTrimmed || '#register';
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

  return {
    label: expired
      ? 'Live now'
      : `Starts in ${pad2(days)}d : ${pad2(hours)}h : ${pad2(minutes)}m : ${pad2(seconds)}s`,
    compactLabel: expired
      ? 'Live now'
      : `${pad2(days)}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`,
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

export function MapPinIcon({ className }: { className?: string }) {
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

export function Topbar({ settings }: { settings: SiteSettings }) {
  const { label, compactLabel } = useCountdown(settings.eventStartsAt);
  const href = resolveButtonHref(settings.registerUrl);
  const external = isExternalHref(href);

  return (
    <div className="topbar">
      <div className="topbar__timer" aria-live="polite">
        <ClockIcon />
        <span className="topbar__countdown topbar__countdown--full">{label}</span>
        <span className="topbar__countdown topbar__countdown--compact">{compactLabel}</span>
      </div>
      <div className="topbar__meta">
        <span className="topbar__seats">{settings.seatsRemaining} seats left</span>
        <a
          className="topbar__cta"
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {settings.registerLabel} <ArrowRightIcon />
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
  return (
    <div className="brand">
      <BrandLogo
        src={resolveLogoUrl(settings.logoUrl)}
        alt={settings.websiteName}
        imageClassName="brand__img"
        nameClassName="brand__logo"
      />
    </div>
  );
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
        <small className="footer-attr">
          {DEFAULTS.ATTRIBUTION_PREFIX}
          <a href={DEFAULTS.ATTRIBUTION_LINK_URL} target="_blank" rel="noreferrer">
            {DEFAULTS.ATTRIBUTION_LINK_LABEL}
          </a>
        </small>
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
  return (
    <div className="public-shell">
      <Topbar settings={settings} />
      <BrandHeader settings={settings} />
      {children}
      <PublicFooter settings={settings} />
      <ScrollTopButton />
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

export function VideoPlayer({
  video,
  title,
  autoPlay = false,
  muted,
  controls,
}: {
  video?: { url?: string; poster?: string; source?: string } | null;
  title: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const url = video?.url || '';
  const poster = video?.poster ? resolveAssetUrl(video.poster) : '';
  const isMuted = muted ?? false;
  const hasControls = controls ?? true;
  const ytId = extractYoutubeId(url);
  const vimeoId = extractVimeoId(url);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlay) return;
    el.muted = isMuted;
    const p = el.play();
    if (p) p.catch(() => {});
  }, [autoPlay, isMuted, url]);

  const handlePlayClick = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
    const p = el.play();
    if (p) p.catch(() => {});
  };

  if (ytId) {
    const params = new URLSearchParams({ rel: '0', controls: '1' });
    if (autoPlay) {
      params.set('autoplay', '1');
      if (isMuted) params.set('mute', '1');
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
    if (autoPlay && isMuted) {
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

  if (url) {
    return (
      <>
        <video
          ref={videoRef}
          muted={isMuted}
          loop={autoPlay && isMuted}
          playsInline
          controls={hasControls}
          preload="metadata"
          poster={poster}
          src={resolveAssetUrl(url)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
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

export function CtaButton({ href, label }: { href: string; label: string }) {
  const resolved = resolveButtonHref(href);
  const external = isExternalHref(resolved);
  return (
    <a
      className="cta-btn"
      href={resolved}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label.replace(/\s*→\s*$/, '')}
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
  const videoObj = rawUrl
    ? rawUrl.includes('dQw4w9WgXcQ') ||
      rawUrl.includes('unsplash') ||
      rawUrl.includes('res.cloudinary.com/dldynfkhm')
      ? {
          source: 'file',
          url: DEFAULTS.HERO_VIDEO,
          poster: DEFAULTS.HERO_POSTER,
        }
      : {
          ...vid,
          poster: fallbackIfDead(asStr(vid.poster), DEFAULTS.HERO_POSTER),
        }
    : {
        source: 'file',
        url: DEFAULTS.HERO_VIDEO,
        poster: DEFAULTS.HERO_POSTER,
      };

  return (
    <section className="hero container center" id="workshop">
      {asStr(data.eyebrow) ? (
        <div className="badge-pill">
          <SectionIcon name="spark" size={14} />
          {asStr(data.eyebrow)}
        </div>
      ) : null}
      {asStr(data.heading) || asStr(data.highlight) || asStr(data.headingEnd) ? (
        <h1 className="heading heading--hero">
          <span className="heading-line">{asStr(data.heading)}</span>
          <em className="heading-line">{asStr(data.highlight)}</em>
          <span className="heading-line">{asStr(data.headingEnd)}</span>
        </h1>
      ) : null}
      <div className="pill-row">
        {asArr(data.pills).map((pill) => (
          <span key={pill.label} className="event-pill">
            <SectionIcon name={pill.icon} size={16} />
            {pill.label}
          </span>
        ))}
      </div>
      <div className="hero-video">
        <div className="video-frame">
          {videoObj ? (
            <VideoPlayer
              video={videoObj}
              title="Workshop preview"
              autoPlay
              muted={false}
              controls
            />
          ) : null}
        </div>
      </div>
      {asStr(data.description) ? (
        <p className="lede lede--hero">{asStr(data.description)}</p>
      ) : null}
      {asStr(data.seatsText) ? <p className="seats">{asStr(data.seatsText)}</p> : null}
      {(asStr(data.originalPrice) || asStr(data.price)) && (
        <div className="price-pill">
          <SectionIcon name="tag" size={16} />
          <s>{asStr(data.originalPrice)}</s>
          <span>Price {asStr(data.price)}</span>
        </div>
      )}
      {asStr(asObj(data.primaryButton).label) ? (
        <div className="hero-cta">
          <CtaButton
            href={resolveCtaHref(asStr(asObj(data.primaryButton).url), registerUrl)}
            label={asStr(asObj(data.primaryButton).label)}
          />
        </div>
      ) : null}
    </section>
  );
}

function IconFeaturesBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="container icon-row">
      {asArr(data.items).map((item) => (
        <div key={item.label} className="icon-tile">
          <SectionIcon name={item.icon} size={20} />
          <strong>{item.label}</strong>
        </div>
      ))}
    </section>
  );
}

function InstructorBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="section container instructor">
      <div className="instructor-card">
        <img
          src={resolveAssetUrl(fallbackIfDead(asStr(data.photo), DEFAULTS.PORTRAIT))}
          alt={asStr(data.name)}
        />
        <div className="instructor-meta">
          <p className="eyebrow">{asStr(data.eyebrow)}</p>
          <h2>{asStr(data.name)}</h2>
          <p className="muted">{asStr(data.title)}</p>
        </div>
      </div>
      <p className="eyebrow speaker-label">{asStr(data.speakingLabel)}</p>
      <div className="logo-row">
        {asArr(data.logos).map((logo) => {
          const imgSrc = resolveSpeakerLogo(logo.label, logo.image);
          return (
            <div key={logo.label} className="logo-badge">
              {imgSrc ? (
                <img src={resolveAssetUrl(imgSrc)} alt={logo.label} />
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
  const rawItems = asArr(data.items);
  const count = rawItems.length > 0 ? Math.max(rawItems.length, DEFAULTS.ATTENDEE_THUMBS.length) : 0;
  if (count === 0) return null;

  const paddedItems = Array.from({ length: count }, (_, idx) => rawItems[idx] || {}).slice(0, count);
  const featuredObj = asObj(data.featured);
  const featuredVideo = {
    source: 'file',
    url: resolveFeaturedVideo(asStr(featuredObj.url)),
    poster: fallbackIfDead(asStr(featuredObj.poster), DEFAULTS.FEATURED_POSTER),
  };

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
            {thumb ? <img src={resolveAssetUrl(thumb)} alt={name} /> : null}
            <span className="play-badge">▶</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="section section--tight-end container center">
      {asStr(data.eyebrow) ? <p className="eyebrow">{asStr(data.eyebrow)}</p> : null}
      {asStr(data.heading) || asStr(data.highlight) ? (
        <h2 className="heading">
          {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
        </h2>
      ) : null}
      {asStr(data.description) ? <p className="lede">{asStr(data.description)}</p> : null}
      <div className="people-row">{paddedItems.slice(0, 4).map((it, i) => renderPersonCard(it, i))}</div>
      <div className="video-frame video-frame--wide" style={{ marginTop: '1.25rem' }}>
        {activeClip === 'featured' ? (
          <VideoPlayer
            video={featuredVideo}
            title="Featured testimonial"
            autoPlay
            muted={false}
            controls
          />
        ) : (
          <>
            <img src={resolveAssetUrl(featuredVideo.poster)} alt="Featured testimonial" />
            <button
              className="video-play-hit"
              type="button"
              onClick={() => setActiveClip('featured')}
              aria-label="Play featured testimonial"
            >
              <span className="play-badge play-badge--lg">▶</span>
            </button>
          </>
        )}
      </div>
      <div className="people-row">
        {paddedItems.slice(4, 8).map((it, i) => renderPersonCard(it, i + 4))}
      </div>
      {typeof seatsRemaining === 'number' ? (
        <p className="seats">{seatsRemaining} seats remaining. Register now!</p>
      ) : null}
      {registerLabel ? (
        <div className="hero-cta">
          <CtaButton href={resolveCtaHref(undefined, registerUrl)} label={registerLabel} />
        </div>
      ) : null}
    </section>
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
    <section className="section container" id="register">
      <div className="cta-card">
        {asStr(data.heading) || asStr(data.highlight) || asStr(data.headingEnd) ? (
          <h2 className="heading" style={{ fontSize: '2.4rem' }}>
            {asStr(data.heading)} <em>{asStr(data.highlight)}</em> {asStr(data.headingEnd)}
          </h2>
        ) : null}
        {asStr(data.description) ? <p className="lede">{asStr(data.description)}</p> : null}
        {asStr(data.seatsText) ? <p className="seats">{asStr(data.seatsText)}</p> : null}
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
          const url = fallbackIfDead(img.url, `/media/proof-${(i % 2) + 1}.webp`);
          return (
            <div key={`${url}-${i}`} className="proof-frame">
              <img src={resolveAssetUrl(url)} alt={img.alt || 'Proof of impact'} />
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
                {img ? <img src={resolveAssetUrl(img)} alt={tr.title} /> : null}
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
  return (
    <section className="section container">
      <div className="center">
        <p className="eyebrow">{asStr(data.eyebrow)}</p>
        <h2 className="heading">
          {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
        </h2>
      </div>
      {asArr(data.categories).map((cat) => {
        const title = asStr(cat.title);
        const layout = title.toUpperCase().includes('ACHIEVEMENT')
          ? 'triple'
          : asStr(cat.layout, 'landscape');
        const ratio =
          layout === 'portrait' ? '3 / 4' : layout === 'square' ? '4 / 3' : '16 / 10';
        return (
          <div key={title}>
            <div className="rule-title">{title}</div>
            <div className={`gallery-grid ${layout}`}>
              {asArr(cat.images).map((img, idx) => (
                <img
                  key={`${title}-${idx}`}
                  src={resolveAssetUrl(resolveGalleryImage(title, idx, img.url))}
                  alt={img.alt || title}
                  style={{ aspectRatio: ratio }}
                />
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
    <section className="section container">
      <div className="rule-title">{asStr(data.heading)}</div>
      <div className="grid-2 team-grid">
        {asArr(data.images).map((img, idx) => (
          <div key={`${img.alt}-${idx}`} className="team-frame">
            <img src={resolveAssetUrl(resolveTeamImage(idx, img.url))} alt={img.alt || 'Team'} />
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
  const first = limited[0];
  const rest = limited.slice(1);

  return (
    <section className="section container center">
      <p className="eyebrow">{asStr(data.eyebrow)}</p>
      <h2 className="heading">
        {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
      </h2>
      <p className="lede">{asStr(data.description)}</p>
      <div className="clip-mosaic">
        {first ? (
          <div className="clip-mosaic__feature">
            <div className="clip-card">
              <img
                src={resolveAssetUrl(resolveMediaClipping(0, first.url))}
                alt={first.alt || 'Newspaper coverage'}
              />
            </div>
          </div>
        ) : null}
        <div className="clip-mosaic__stack">
          {rest.map((clip, idx) => (
            <div key={`${clip.url}-${idx}`} className="clip-card">
              <img
                src={resolveAssetUrl(resolveMediaClipping(idx + 1, clip.url))}
                alt={clip.alt || `Newspaper coverage ${idx + 2}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsappFeedbackBlock({ data }: { data: Record<string, any> }) {
  const messages = asArr(data.messages);
  if (!messages.length) return null;
  return (
    <section className="section container center">
      <p className="eyebrow">{asStr(data.eyebrow)}</p>
      <h2 className="heading">
        {asStr(data.heading)} <em>{asStr(data.highlight)}</em>
      </h2>
      <p className="lede">{asStr(data.description)}</p>
      <div className="phones" style={{ marginTop: '1.5rem' }}>
        {messages.map((msg, idx) => (
          <div key={msg.name || String(idx)} className="phone">
            <img
              src={resolveAssetUrl(resolveWhatsappScreenshot(idx, msg.screenshot))}
              alt={msg.name || `WhatsApp feedback ${idx + 1}`}
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
    case 'contact_form':
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
    case 'proof_impact':
      return !hasAnyStr(d.eyebrow, d.heading, d.highlight, d.description) && !hasAnyArr(d.images);
    case 'workshop_tracks':
    case 'features':
      return (
        !hasAnyStr(d.eyebrow, d.heading, d.highlight, d.description) &&
        !hasAnyArr(d.tracks ?? d.items)
      );
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
    case 'cta':
      content = (
        <CtaSectionBlock
          data={section.data}
          registerUrl={registerUrl}
          registerLabel={registerLabel}
        />
      );
      break;
    case 'proof_impact':
      content = <ProofImpactBlock data={section.data} />;
      break;
    case 'workshop_tracks':
    case 'features':
      content = <WorkshopTracksBlock data={section.data} />;
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
    case 'contact_form':
      content = (
        <ContactFormBlock
          data={section.data}
          sourcePage={sourcePage}
          onSubmit={onLeadSubmit}
          status={leadStatus}
        />
      );
      break;
    case 'spacer':
      content = <div style={{ height: Number(section.data.height || 48) }} />;
      break;
    default:
      content = null;
  }

  return content ? <div className={`theme-${theme || 'classic'}`}>{content}</div> : null;
}
