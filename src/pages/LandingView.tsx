import React, { useEffect, useState } from 'react';
import {
  cmsApi,
  filterVisibleSections,
  resolveAssetUrl,
  useSitePayload,
} from '@/lib/cms';
import {
  formatWhatsappUrl,
  PublicShell,
  SectionRenderer,
} from '@/components/PublicSections';

const REVEAL_SELECTORS = [
  '.icon-tile',
  '.track-card',
  '.person-card',
  '.phone',
  '.gallery-grid img',
  '.team-frame',
  '.proof-frame',
  '.clip-card',
  '.logo-badge',
  '.check-item',
  '.instructor-card',
  '.audience-card',
].join(', ');

function useScrollReveal(pageId?: string, version?: number) {
  useEffect(() => {
    if (!pageId) return;
    const shell = document.querySelector('.public-shell');
    if (!shell) return;
    const elements = shell.querySelectorAll(REVEAL_SELECTORS);
    const markVisible = (el: Element) => el.classList.add('is-in');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(markVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pageId, version]);
}

export function LandingView({ slug }: { slug?: string }) {
  const { payload, version } = useSitePayload(slug);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const { page, settings, navigation, related } = payload;

  useEffect(() => {
    if (!page) return;
    document.title = page.seoTitle || page.title || settings.websiteName || 'AI School Raipur';
    const desc = page.seoDescription || settings.seoDescription || '';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    if (settings.faviconUrl) {
      let icon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!icon) {
        icon = document.createElement('link');
        icon.rel = 'icon';
        document.head.appendChild(icon);
      }
      icon.href = resolveAssetUrl(settings.faviconUrl);
    }
  }, [page, settings]);

  useScrollReveal(page?.id, version);

  useEffect(() => {
    if (leadStatus !== 'success') return;
    const waUrl = formatWhatsappUrl(
      settings.socialLinks?.whatsapp,
      'Hi, I just reserved my seat on the AI School Raipur workshop page.'
    );
    const timer = window.setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
    return () => window.clearTimeout(timer);
  }, [leadStatus, settings.socialLinks?.whatsapp]);

  const handleLeadSubmit = (lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    sourcePage: string;
  }) => {
    setLeadStatus('saving');
    try {
      cmsApi.createLead(lead);
      setLeadStatus('success');
    } catch {
      setLeadStatus('error');
    }
  };

  const theme = payload.theme || page.theme || 'classic';

  return (
    <PublicShell settings={settings} navigation={navigation}>
      <div className={`landing-theme theme-${theme}`}>
        {filterVisibleSections(page.sections || []).map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={theme}
            related={related}
            sourcePage={page.slug}
            onLeadSubmit={handleLeadSubmit}
            leadStatus={leadStatus}
            seatsRemaining={settings.seatsRemaining}
            registerUrl={page.registerUrl || settings.registerUrl}
            registerLabel={page.registerLabel || settings.registerLabel}
          />
        ))}
      </div>
    </PublicShell>
  );
}
