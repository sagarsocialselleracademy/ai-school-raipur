import { useCallback, useEffect, useState } from 'react';
import {
  CourseItem,
  DEFAULTS,
  FaqItem,
  INITIAL_COURSES,
  INITIAL_FAQS,
  INITIAL_NAVIGATION,
  INITIAL_PAGES,
  INITIAL_SETTINGS,
  INITIAL_TESTIMONIALS,
  LandingPage,
  LeadItem,
  MediaFile,
  NavItem,
  PageDomain,
  PageSection,
  SiteSettings,
  TestimonialItem,
} from './data';

const STORAGE_KEYS = {
  AUTH: 'aischool_auth_token',
  SETTINGS: 'aischool_settings_v7',
  PAGES: 'aischool_pages_v7',
  NAV: 'aischool_nav_v7',
  COURSES: 'aischool_courses_v7',
  TESTIMONIALS: 'aischool_testimonials_v7',
  FAQS: 'aischool_faqs_v7',
  LEADS: 'aischool_leads_v7',
  MEDIA: 'aischool_media_v7',
};

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('aischool-store-update'));
  } catch {
    // ignore storage quota errors
  }
}

export function resetAllCmsData(): void {
  Object.values(STORAGE_KEYS).forEach((k) => {
    if (k !== STORAGE_KEYS.AUTH) localStorage.removeItem(k);
  });
  window.dispatchEvent(new Event('aischool-store-update'));
}

const BUILTIN_MEDIA: MediaFile[] = [
  {
    id: 'media-logo',
    url: '/logo.png',
    originalFilename: 'logo.png',
    mimeType: 'image/png',
    size: 42100,
    title: 'Site Logo',
  },
  {
    id: 'media-portrait',
    url: '/lakshit-portrait.jpg',
    originalFilename: 'lakshit-portrait.jpg',
    mimeType: 'image/jpeg',
    size: 128400,
    title: 'Lakshit Sethiya Portrait',
  },
  {
    id: 'media-hero-poster',
    url: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
    originalFilename: 'hero-poster.jpg',
    mimeType: 'image/jpeg',
    size: 98200,
    title: 'Workshop Hero Poster',
  },
  {
    id: 'media-cm-award',
    url: '/moments-with-lakshit/awarded-by-chiefminister-of-chhattisgarh.png',
    originalFilename: 'awarded-by-cm.jpg',
    mimeType: 'image/jpeg',
    size: 164000,
    title: 'Awarded by Chief Minister of Chhattisgarh',
  },
  {
    id: 'media-team-1',
    url: '/moments-with-lakshit/meet-our-team/img1.png',
    originalFilename: 'team-1.png',
    mimeType: 'image/png',
    size: 215000,
    title: 'Team Photo',
  },
];

const PLACEHOLDER_REGEX =
  /unsplash\.com|dQw4w9WgXcQ|images\.unsplash|res\.cloudinary\.com\/dldynfkhm/i;

export function isInvalidOrDeadMedia(url?: string | null): boolean {
  if (!url) return true;
  return PLACEHOLDER_REGEX.test(url);
}

export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('/')
  ) {
    return url;
  }
  return `/${url}`;
}

export function fallbackIfDead(url: string | undefined, fallback: string): string {
  return url && !isInvalidOrDeadMedia(url) ? url : fallback;
}

export function resolveLogoUrl(url?: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed || isInvalidOrDeadMedia(trimmed)) return DEFAULTS.LOGO_URL;
  return trimmed;
}

export function resolveSpeakerLogo(label: string, image?: string): string {
  if (image && !isInvalidOrDeadMedia(image)) return image;
  return DEFAULTS.SPEAKER_LOGOS[label] || '';
}

export function resolveTrackImage(title: string, image?: string): string {
  if (image && !isInvalidOrDeadMedia(image)) return image;
  return DEFAULTS.TRACKS[title] || '/topic-business.jpg';
}

export function resolveTrackIcon(title: string, icon?: string): string {
  return icon || DEFAULTS.TRACK_ICONS[title] || 'spark';
}

export function resolveWhatsappScreenshot(index: number, url?: string): string {
  if (url && !isInvalidOrDeadMedia(url)) return url;
  return `/whatsapp-feedback/img${(index % 6) + 1}.png`;
}

export function resolveMediaClipping(index: number, url?: string): string {
  const trimmed = (url || '').trim();
  if (trimmed && !isInvalidOrDeadMedia(trimmed)) return trimmed;
  return `/media-coverage/img${(index % 3) + 1}.png`;
}

function getCategoryFolder(title: string): string | null {
  const upper = title.toUpperCase();
  if (upper.includes('WORKSHOP PLACE')) return 'workshop-place';
  if (upper.includes('SHARING STAGE')) return 'sharing-stage';
  if (upper.includes('WORKSHOP') && upper.includes('TRAINING'))
    return 'offline-workshops-and-training';
  if (upper.includes('MEETUP')) return 'offline-meetups-and-training';
  if (upper.includes('AWARDED')) return 'awarded';
  if (upper.includes('ACHIEVEMENT')) return 'achievements-and-awards';
  if (upper.includes('MEET OUR TEAM')) return 'meet-our-team';
  return null;
}

export function resolveTeamImage(index: number, url?: string): string {
  const trimmed = (url || '').trim();
  if (trimmed && !isInvalidOrDeadMedia(trimmed)) return trimmed;
  return `/moments-with-lakshit/meet-our-team/img${(index % 2) + 1}.png`;
}

export function resolveGalleryImage(categoryTitle: string, index: number, url?: string): string {
  const trimmed = (url || '').trim();
  if (trimmed && !isInvalidOrDeadMedia(trimmed)) return trimmed;
  const folder = getCategoryFolder(categoryTitle);
  if (folder === 'awarded') {
    return '/moments-with-lakshit/awarded-by-chiefminister-of-chhattisgarh.png';
  }
  if (folder) {
    return `/moments-with-lakshit/${folder}/img${index + 1}.png`;
  }
  return trimmed;
}

export function resolveAttendeeThumb(index: number, url?: string): string {
  if (url && !isInvalidOrDeadMedia(url)) return url;
  return DEFAULTS.ATTENDEE_THUMBS[index] || DEFAULTS.ATTENDEE_THUMBS[0];
}

export function resolveAttendeeVideo(index: number, url?: string): string {
  if (url && !isInvalidOrDeadMedia(url)) return url;
  return DEFAULTS.ATTENDEE_VIDEOS[index] || DEFAULTS.ATTENDEE_VIDEOS[0];
}

export function resolveFeaturedVideo(url?: string): string {
  if (url && !isInvalidOrDeadMedia(url) && !url.endsWith('cbdc6004a1938decb1073560ba53eca52b8d75db.bin')) {
    return url;
  }
  return DEFAULTS.FEATURED_VIDEO;
}

export function filterVisibleSections(sections: PageSection[]): PageSection[] {
  const reversedIdx = [...sections]
    .map((section, index) => ({ section, index }))
    .reverse()
    .find(({ section }) => {
      if (section.type !== 'cta') return false;
      const h = String(section.data.heading || '');
      const hl = String(section.data.highlight || '');
      return !!(h || hl);
    })?.index;

  const filtered = sections.filter(
    (sec, idx) =>
      !(
        sec.enabled === false ||
        (typeof reversedIdx === 'number' &&
          idx > reversedIdx &&
          (sec.type === 'media_coverage' || sec.type === 'whatsapp_feedback'))
      )
  );

  const commonFaqIdx = filtered.findIndex((sec) =>
    sec.type !== 'faq'
      ? false
      : String(sec.data.heading || '')
          .toLowerCase()
          .includes('common questions')
  );
  const firstFaqIdx = commonFaqIdx >= 0 ? commonFaqIdx : filtered.findIndex((s) => s.type === 'faq');

  return filtered.filter((sec, idx) => (sec.type !== 'faq' ? true : idx === firstFaqIdx));
}

export const cmsApi = {
  getSettings(): SiteSettings {
    return readStore(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  updateSettings(patch: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const next = { ...current, ...patch };
    writeStore(STORAGE_KEYS.SETTINGS, next);
    return next;
  },
  listPages(params?: { search?: string; status?: string }): LandingPage[] {
    let pages = readStore(STORAGE_KEYS.PAGES, INITIAL_PAGES);
    if (params?.search) {
      const q = params.search.toLowerCase();
      pages = pages.filter(
        (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      );
    }
    if (params?.status) {
      pages = pages.filter((p) => p.status === params.status);
    }
    return pages;
  },
  getPage(idOrSlug: string): LandingPage | null {
    const pages = readStore(STORAGE_KEYS.PAGES, INITIAL_PAGES);
    return pages.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },
  updatePage(id: string, patch: Partial<LandingPage>): LandingPage | null {
    const pages = readStore(STORAGE_KEYS.PAGES, INITIAL_PAGES);
    const idx = pages.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated: LandingPage = {
      ...pages[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    pages[idx] = updated;
    writeStore(STORAGE_KEYS.PAGES, pages);
    return updated;
  },
  createPage(input: Partial<LandingPage>): LandingPage {
    const pages = readStore(STORAGE_KEYS.PAGES, INITIAL_PAGES);
    const newPage: LandingPage = {
      id: `page-${Date.now()}`,
      name: input.name || 'Untitled Page',
      title: input.title || input.name || 'Untitled Page',
      slug: input.slug || `page-${Date.now()}`,
      description: input.description || '',
      status: 'PUBLISHED',
      seoTitle: input.seoTitle || '',
      seoDescription: input.seoDescription || '',
      ogImage: '',
      facebookPixelId: '',
      theme: input.theme || 'classic',
      registerUrl: INITIAL_SETTINGS.registerUrl,
      registerLabel: 'Register Now',
      eventStartsAt: INITIAL_SETTINGS.eventStartsAt,
      updatedAt: new Date().toISOString(),
      sections: [],
      domains: [],
    };
    pages.unshift(newPage);
    writeStore(STORAGE_KEYS.PAGES, pages);
    return newPage;
  },
  duplicatePage(id: string): LandingPage | null {
    const pages = readStore(STORAGE_KEYS.PAGES, INITIAL_PAGES);
    const orig = pages.find((p) => p.id === id);
    if (!orig) return null;
    const copy: LandingPage = {
      ...JSON.parse(JSON.stringify(orig)),
      id: `page-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      slug: `${orig.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      updatedAt: new Date().toISOString(),
    };
    pages.unshift(copy);
    writeStore(STORAGE_KEYS.PAGES, pages);
    return copy;
  },
  deletePage(id: string): void {
    const pages = readStore(STORAGE_KEYS.PAGES, INITIAL_PAGES).filter((p) => p.id !== id);
    writeStore(STORAGE_KEYS.PAGES, pages);
  },
  addSection(pageId: string, type: string): PageSection | null {
    const page = this.getPage(pageId);
    if (!page) return null;
    const defaultData: Record<string, any> =
      type === 'hero'
        ? {
            eyebrow: 'Live Workshop',
            heading: 'Advance AI',
            highlight: 'Masterclass',
            headingEnd: 'in Raipur',
            description: 'Learn practical AI workflows in 3 hours.',
            pills: [{ icon: 'calendar', label: 'Upcoming Sunday' }],
            originalPrice: '₹2499',
            price: '₹1999 only',
            seatsText: '23 seats remaining!',
            primaryButton: { label: 'Register Now →', url: '#register' },
          }
        : type === 'cta'
          ? {
              heading: 'See you',
              highlight: '',
              headingEnd: 'at the workshop',
              description: 'Reserve your seat today.',
              seatsText: '23 seats remaining. Register now!',
              button: { label: 'Register Now →', url: '#register' },
            }
          : type === 'text'
            ? { eyebrow: 'OVERVIEW', heading: 'Section Heading', highlight: '', body: 'Add your copy here.' }
            : {};
    const newSec: PageSection = {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      pageId,
      type,
      enabled: true,
      sortOrder: page.sections.length,
      data: defaultData,
    };
    this.updatePage(pageId, { sections: [...page.sections, newSec] });
    return newSec;
  },
  updateSection(pageId: string, sectionId: string, patch: Partial<PageSection>): PageSection | null {
    const page = this.getPage(pageId);
    if (!page) return null;
    let updatedSec: PageSection | null = null;
    const sections = page.sections.map((s) => {
      if (s.id === sectionId) {
        updatedSec = { ...s, ...patch };
        return updatedSec;
      }
      return s;
    });
    this.updatePage(pageId, { sections });
    return updatedSec;
  },
  deleteSection(pageId: string, sectionId: string): void {
    const page = this.getPage(pageId);
    if (!page) return;
    this.updatePage(pageId, { sections: page.sections.filter((s) => s.id !== sectionId) });
  },
  listFaqs(): FaqItem[] {
    return readStore(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  },
  createFaq(input: Omit<FaqItem, 'id'>): FaqItem {
    const faqs = this.listFaqs();
    const item: FaqItem = { ...input, id: `faq-${Date.now()}` };
    writeStore(STORAGE_KEYS.FAQS, [...faqs, item]);
    return item;
  },
  updateFaq(id: string, patch: Partial<FaqItem>): void {
    const faqs = this.listFaqs().map((f) => (f.id === id ? { ...f, ...patch } : f));
    writeStore(STORAGE_KEYS.FAQS, faqs);
  },
  deleteFaq(id: string): void {
    writeStore(
      STORAGE_KEYS.FAQS,
      this.listFaqs().filter((f) => f.id !== id)
    );
  },
  listTestimonials(): TestimonialItem[] {
    return readStore(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  },
  createTestimonial(input: Partial<TestimonialItem>): TestimonialItem {
    const list = this.listTestimonials();
    const item: TestimonialItem = {
      id: `test-${Date.now()}`,
      name: input.name || 'Attendee',
      designation: input.designation || '',
      company: input.company || '',
      profileImage: input.profileImage || '',
      quote: input.quote || '',
      rating: input.rating || 5,
      sortOrder: input.sortOrder ?? list.length + 1,
      status: 'PUBLISHED',
    };
    writeStore(STORAGE_KEYS.TESTIMONIALS, [...list, item]);
    return item;
  },
  deleteTestimonial(id: string): void {
    writeStore(
      STORAGE_KEYS.TESTIMONIALS,
      this.listTestimonials().filter((t) => t.id !== id)
    );
  },
  listCourses(): CourseItem[] {
    return readStore(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  },
  listLeads(sourcePage?: string): LeadItem[] {
    const leads = readStore<LeadItem[]>(STORAGE_KEYS.LEADS, []);
    if (sourcePage) return leads.filter((l) => l.sourcePage === sourcePage);
    return leads;
  },
  createLead(input: Omit<LeadItem, 'id' | 'status' | 'createdAt'>): LeadItem {
    const leads = this.listLeads();
    const item: LeadItem = {
      ...input,
      id: `lead-${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    writeStore(STORAGE_KEYS.LEADS, [item, ...leads]);
    return item;
  },
  updateLeadStatus(id: string, status: LeadItem['status']): void {
    const leads = this.listLeads().map((l) => (l.id === id ? { ...l, status } : l));
    writeStore(STORAGE_KEYS.LEADS, leads);
  },
  listNav(): NavItem[] {
    return readStore(STORAGE_KEYS.NAV, INITIAL_NAVIGATION);
  },
  updateNav(items: NavItem[]): void {
    writeStore(STORAGE_KEYS.NAV, items);
  },
  listMedia(): MediaFile[] {
    return readStore(STORAGE_KEYS.MEDIA, BUILTIN_MEDIA);
  },
  uploadMedia(file: File): Promise<MediaFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const item: MediaFile = {
          id: `media-${Date.now()}`,
          url: String(reader.result || ''),
          originalFilename: file.name,
          mimeType: file.type || 'image/png',
          size: file.size,
          title: file.name,
        };
        const current = this.listMedia();
        writeStore(STORAGE_KEYS.MEDIA, [item, ...current]);
        resolve(item);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
  deleteMedia(id: string): void {
    writeStore(
      STORAGE_KEYS.MEDIA,
      this.listMedia().filter((m) => m.id !== id)
    );
  },
};

export function useSitePayload(slug?: string) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onUpdate = () => setVersion((v) => v + 1);
    window.addEventListener('aischool-store-update', onUpdate);
    return () => window.removeEventListener('aischool-store-update', onUpdate);
  }, []);

  const settings = cmsApi.getSettings();
  const pages = cmsApi.listPages();
  const targetSlug = slug || settings.homePageSlug || 'home-copy';
  const page =
    pages.find((p) => p.slug === targetSlug || p.id === targetSlug) || pages[0] || INITIAL_PAGES[0];

  const related = {
    courses: cmsApi.listCourses().filter((c) => c.status === 'PUBLISHED'),
    testimonials: cmsApi.listTestimonials().filter((t) => t.status === 'PUBLISHED'),
    faqs: cmsApi.listFaqs().filter((f) => f.status === 'PUBLISHED'),
  };

  return {
    payload: {
      hostname: 'aischoolraipur.com',
      theme: page.theme || 'classic',
      page,
      settings,
      navigation: cmsApi.listNav(),
      related,
    },
    loading: false,
    error: null,
    reload: () => setVersion((v) => v + 1),
    version,
  };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem(STORAGE_KEYS.AUTH)
  );

  const login = useCallback(async (email: string, _password: string) => {
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ name: 'Lakshit Sethiya', email, role: 'SUPER_ADMIN' })
    );
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setIsAuthenticated(false);
  }, []);

  const user = isAuthenticated
    ? { name: 'Lakshit Sethiya', email: 'support@socialseller.in', role: 'SUPER_ADMIN' }
    : null;

  return { isAuthenticated, isLoading: false, user, login, logout };
}
