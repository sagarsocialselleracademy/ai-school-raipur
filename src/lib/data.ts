export interface SiteSettings {
  id: string;
  websiteName: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    linkedin: string;
    facebook: string;
    whatsapp: string;
  };
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  homePageSlug: string;
  seatsRemaining: number;
  eventStartsAt: string;
  registerUrl: string;
  registerLabel: string;
  facebookPixelId: string;
  footerJson: {
    description: string;
    copyright: string;
    attribution: string;
    tagline: string;
    ctaLabel: string;
    ctaUrl: string;
    phones?: string[];
    linkGroups?: Array<{
      title: string;
      links: Array<{ label: string; url: string }>;
    }>;
  };
}

export interface NavItem {
  id: string;
  label: string;
  type: 'INTERNAL' | 'LANDING_PAGE' | 'EXTERNAL' | 'ANCHOR';
  url: string;
  pageSlug?: string;
  sortOrder?: number;
  enabled: boolean;
}

export interface PageSection {
  id: string;
  pageId: string;
  type: string;
  enabled: boolean;
  sortOrder: number;
  data: Record<string, any>;
}

export interface PageDomain {
  id: string;
  pageId: string;
  hostname: string;
  isPrimary?: boolean;
  enabled?: boolean;
}

export interface LandingPage {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage: string;
  facebookPixelId: string;
  theme: 'classic' | 'modern' | 'bold' | 'minimal' | 'studio' | string;
  registerUrl: string;
  registerLabel: string;
  eventStartsAt: string;
  updatedAt: string;
  sections: PageSection[];
  domains?: PageDomain[];
}

export interface CourseItem {
  id: string;
  title: string;
  slug?: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  discountPrice?: number | null;
  duration?: string;
  level?: string;
  mode?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

export interface TestimonialItem {
  id: string;
  name: string;
  designation: string;
  company?: string;
  profileImage?: string;
  quote: string;
  rating: number;
  sortOrder: number;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  sortOrder: number;
}

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED';
  sourcePage: string;
  createdAt: string;
}

export interface MediaFile {
  id: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  altText?: string;
  title?: string;
}

export const DEFAULTS = {
  LOGO_URL: '/logo.png?v=2',
  PORTRAIT: '/lakshit-portrait.jpg',
  HERO_VIDEO: '/media/8036923a12fdf959fea2c6bd37a710b3d69c679b.bin',
  HERO_POSTER: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
  FEATURED_POSTER: '/media/cbdc6004a1938decb1073560ba53eca52b8d75db.bin',
  FEATURED_VIDEO: '/media/hero-intro.mp4',
  ATTENDEE_THUMBS: [
    '/media/1434f4ca4ccf3676b9a0f36e0ae82577854f11d0.bin',
    '/media/d842cf0108ff20dc3c2bf0a4051716d915e75aac.bin',
    '/media/1240d205e7cfd62bf485f704126c0b8fe4187826.bin',
    '/media/bdc6cd4178db5b587ccee2d28978aad93a6b7966.bin',
    '/media/45c4d2a04f4c07e20f8e96b9cf3f1183.webp.webp',
    '/media/2ed567f1033ba2dff571fbfa121d1d2a.webp.webp',
    '/media/e5a3a29d98e604787daf5cdcd54f5402.webp.webp',
    '/media/acaff6ee58ec84d3a986e812724afd9b.webp.webp',
  ],
  ATTENDEE_VIDEOS: [
    '/media/77a609b4dbbfa6f8aa32a6df3c82a0c505d8aa1d.bin',
    '/media/2ff24f7ba276866641d0be29820afd010ef40f7f.bin',
    '/media/9841a049251b1c1b1c4499bf0a8a0ee3d8bde7cd.bin',
    '/media/5e871ca6dd38263d53552fb445218ce675810a0f.bin',
    'https://www.youtube.com/embed/4v2s9jtJpsA',
    'https://www.youtube.com/embed/4OmjGEU_H9M',
    'https://www.youtube.com/embed/2qL19nwj8xg',
    'https://www.youtube.com/embed/VQALn2S72f0',
  ],
  YOUTUBE: 'https://www.youtube.com/@socialselleracademy',
  INSTAGRAM: 'https://www.instagram.com/socialseller_academy',
  PHONES: ['+91 8816933028', '+91 8370044449'],
  WHATSAPP_NUMBER: '8370044449',
  ADDRESS:
    'Aarambh - Raipur Startup Incubation & Innovation Centre, 3rd Floor, Multi Level Car Parking, Jaistambh Chowk, Moudhapara, Raipur, Chhattisgarh 492001',
  FOOTER_BY: 'By Lakshit Sethiya',
  FOOTER_DESCRIPTION:
    "India's Most Advance AI & Automation Masterclass — helping professionals and entrepreneurs master AI tools and grow their business.",
  COPYRIGHT: '© 2026 Social Seller Academy. All rights reserved.',
  ATTRIBUTION_PREFIX: 'AI School Raipur · Powered by ',
  ATTRIBUTION_LINK_LABEL: 'DeveloperBox AI Factory',
  ATTRIBUTION_LINK_URL: 'https://developerbox.co.in',
  LOGIN_POWERED_BY_PREFIX: 'Powered by ',
  SPEAKER_LOGOS: {
    'IIM Nagpur': '/speakes-at/iim-nagpur.png',
    'IIT Indore': '/speakes-at/iit-indore.png',
    JITO: '/speakes-at/jito.png',
    JCI: '/speakes-at/jci.png',
    ITM: '/speakes-at/itm-university.png',
    'Chamber of Commerce': '/speakes-at/ccci.png',
  } as Record<string, string>,
  TRACKS: {
    'Business Decisions': '/topic-business.jpg',
    Marketing: '/topic-marketing.jpg',
    'Video Creation': '/topic-video.jpg',
    Automation: '/topic-automation.jpg',
    'Software Development': '/topic-code.jpg',
    Research: '/topic-research.jpg',
    Recruitment: '/topic-recruitment.jpg',
    Proposals: '/topic-proposals.jpg',
  } as Record<string, string>,
  TRACK_ICONS: {
    'Business Decisions': 'shield',
    Marketing: 'send',
    'Video Creation': 'video',
    Automation: 'grid',
    'Software Development': 'code',
    Research: 'search',
    Recruitment: 'users',
    Proposals: 'file',
  } as Record<string, string>,
  MEDIA_CLIP_COUNT: 3,
};

export const INITIAL_SETTINGS: SiteSettings = {
  id: 'default',
  websiteName: 'AI School Raipur',
  logoUrl: '/logo.png?v=2',
  faviconUrl: '/favicon.png?v=2',
  contactEmail: 'support@socialseller.in',
  phone: '+91 8816933028, +91 8370044449',
  address:
    'Aarambh - Raipur Startup Incubation & Innovation Centre, 3rd Floor, Multi Level Car Parking, Jaistambh Chowk, Moudhapara, Raipur, Chhattisgarh 492001',
  socialLinks: {
    instagram: 'https://www.instagram.com/socialseller_academy',
    youtube: 'https://www.youtube.com/@socialselleracademy',
    linkedin: 'https://linkedin.com',
    facebook: '',
    whatsapp: 'https://wa.me/918370044449',
  },
  brandColors: {
    primary: '#ff5a2c',
    secondary: '#0a0706',
    accent: '#ff3d1a',
  },
  seoTitle: "Raipur's Most Advance Ai & Automation Masterclass",
  seoDescription:
    'A Full Day live Physical workshop by Lakshit Sethiya, where you’ll discover how to scale your business using ai & automation',
  ogImage: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
  homePageSlug: 'home-copy',
  seatsRemaining: 23,
  eventStartsAt: '2026-11-29T10:30:00+05:30',
  registerUrl: 'https://rzp.io/rzp/hEo9sFF5',
  registerLabel: 'Register Now',
  facebookPixelId: '762245465547904',
  footerJson: {
    description:
      'AI & Automation Masterclass by Lakshit Sethiya. Practical tools, live demos, and templates you can deploy the same day.',
    copyright: '© 2026 Social Seller Academy. All rights reserved.',
    attribution: 'AI School Raipur · Powered by Social Seller',
    tagline: 'By Lakshit Sethiya',
    ctaLabel: 'Register Now',
    ctaUrl: '#register',
    linkGroups: [
      {
        title: 'Quick Links',
        links: [
          { label: 'Register', url: '#register' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
      },
    ],
  },
};

export const INITIAL_NAVIGATION: NavItem[] = [
  { id: 'nav-1', label: 'Workshop', type: 'ANCHOR', url: '#workshop', enabled: true },
  { id: 'nav-2', label: 'Tracks', type: 'ANCHOR', url: '#tracks', enabled: true },
  { id: 'nav-3', label: 'Proof', type: 'ANCHOR', url: '#proof', enabled: true },
  { id: 'nav-4', label: 'FAQ', type: 'ANCHOR', url: '#faq', enabled: true },
  { id: 'nav-5', label: 'Register', type: 'ANCHOR', url: '#register', enabled: true },
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'cmthabu1q0005aif72j8drjel',
    question: 'Do I need any technical background?',
    answer:
      'No. This workshop is built for business owners, founders, marketers, and operators. We start from practical use-cases, not code.',
    category: 'general',
    status: 'PUBLISHED',
    sortOrder: 1,
  },
  {
    id: 'cmthabu1q0006aif743uejt3m',
    question: 'Will I get the recordings?',
    answer: 'Yes. You get lifetime access to the workshop recordings after the live session.',
    category: 'general',
    status: 'PUBLISHED',
    sortOrder: 2,
  },
  {
    id: 'cmthabu1q0007aif7xqlck06n',
    question: 'What if I miss a session?',
    answer:
      'You will still receive the recording and templates so you can catch up on your own schedule.',
    category: 'general',
    status: 'PUBLISHED',
    sortOrder: 3,
  },
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'cmthabu1i0002aif7delu49mb',
    name: 'Naman Lodha',
    designation: 'JCI',
    company: 'JCI',
    profileImage: '',
    quote: 'Wonderful session. Note: This is written by me personally and not any AI tool.',
    rating: 5,
    status: 'PUBLISHED',
    sortOrder: 1,
  },
  {
    id: 'cmthabu1i0003aif7cm5lmuyz',
    name: 'Anurag Jain',
    designation: 'Founder',
    company: '',
    profileImage: '',
    quote:
      'Thank you Lakshit for guidance in our unguided AI learning journey. Practical approach throughout.',
    rating: 5,
    status: 'PUBLISHED',
    sortOrder: 2,
  },
  {
    id: 'cmthabu1i0004aif7sla9052e',
    name: 'Ruchi Jain',
    designation: 'Entrepreneur',
    company: '',
    profileImage: '',
    quote: 'Dear Lakshit Sir, thank you for the clarity, patience, and effort you put into teaching.',
    rating: 5,
    status: 'PUBLISHED',
    sortOrder: 3,
  },
];

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'cmthabu1a0001aif7qf5i688a',
    title: 'AI & Automation Masterclass',
    slug: 'ai-automation-masterclass',
    shortDescription: 'A 3-hour live workshop that can change the way you do business.',
    fullDescription:
      'Master 30+ AI tools with live practical demos, templates you can deploy the same day, Q&A, and lifetime recordings.',
    duration: '3 hours',
    level: 'All levels',
    mode: 'Offline - Raipur',
    price: 2499,
    discountPrice: 1999,
    ctaLabel: 'Register Now',
    ctaUrl: 'https://rzp.io/rzp/hEo9sFF5',
    status: 'PUBLISHED',
  },
];

export const INITIAL_PAGES: LandingPage[] = [
  {
    id: 'cmtjtmwbs0000b5xs4vvu1rtu',
    name: "Raipur's Most Advance Ai & Automation Masterclass",
    title: "Raipur's Most Advance Ai & Automation Masterclass",
    slug: 'home-copy',
    description: 'Live workshop by Lakshit Sethiya in Raipur.',
    status: 'PUBLISHED',
    seoTitle: "Raipur's Most Advance Ai & Automation Masterclass",
    seoDescription:
      'A Full Day live Physical workshop by Lakshit Sethiya, where you’ll discover how to scale your business using ai & automation',
    seoKeywords: 'AI workshop, automation, Raipur, Lakshit Sethiya',
    ogTitle: "Raipur's Most Advance Ai & Automation Masterclass",
    ogDescription: 'Master 30+ Ai Tools in a Full Day live Physical workshop.',
    ogImage: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
    facebookPixelId: '762245465547904',
    theme: 'classic',
    registerUrl: 'https://rzp.io/rzp/hEo9sFF5',
    registerLabel: 'Register Now',
    eventStartsAt: '2026-11-29T10:30:00+05:30',
    updatedAt: '2026-10-26T08:30:00.000Z',
    domains: [
      {
        id: 'cmtjy8nif0014b5xsr8nelah3',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        hostname: 'aischoolraipur.in',
        isPrimary: true,
        enabled: true,
      },
      {
        id: 'cmtjy8nif0014b5xsr8nelah4',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        hostname: 'www.aischoolraipur.in',
        isPrimary: false,
        enabled: true,
      },
      {
        id: 'cmtjy8nif0014b5xsr8nelah5',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        hostname: 'aischoolraipur.com',
        isPrimary: false,
        enabled: true,
      },
    ],
    sections: [
      {
        id: 'cmtjtmwc70002b5xs2ls65d3l',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'hero',
        enabled: true,
        sortOrder: 0,
        data: {
          eyebrow: '2000+ people attended in Raipur',
          heading: "Raipur's Most Advance ",
          highlight: 'Ai & Automation',
          headingEnd: 'Masterclass ',
          description:
            'A Full Day live Physical workshop by Lakshit Sethiya, where you’ll discover how to scale your business using ai & automation',
          video: {
            source: 'file',
            url: '/media/8036923a12fdf959fea2c6bd37a710b3d69c679b.bin',
            poster: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
          },
          alignment: 'center',
          pills: [
            { icon: 'calendar', label: '29th November' },
            { icon: 'clock', label: '10:30AM - 4:00 PM' },
            { icon: 'pin', label: 'Vimtara Hall, Raipur' },
            { icon: 'users', label: 'Lunch Included' },
          ],
          originalPrice: '₹2499',
          price: '₹1999 only',
          seatsText: '23 seats remaining. Register now!',
          primaryButton: {
            label: 'Register Now →',
            url: 'https://rzp.io/rzp/hEo9sFF5',
          },
          secondaryButton: { label: '', url: '' },
        },
      },
      {
        id: 'cmtjtmwcs0004b5xs5icgdirt',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'icon_features',
        enabled: true,
        sortOrder: 1,
        data: {
          items: [
            { icon: 'spark', label: 'Master 30+ Ai Tools' },
            { icon: 'play', label: 'Live practical demo' },
            { icon: 'chat', label: 'Q&A Session' },
            { icon: 'fork', label: 'Lunch included' },
          ],
        },
      },
      {
        id: 'cmtjtmwd00006b5xsj9e3eta8',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'instructor',
        enabled: true,
        sortOrder: 2,
        data: {
          eyebrow: 'Your Instructor',
          name: 'Lakshit Sethiya',
          title: 'AI & Automation Strategist',
          photo: '/lakshit-portrait.jpg',
          speakingLabel: 'Speaker at',
          logos: [
            { label: 'IIM Nagpur', image: '/speakes-at/iim-nagpur.png' },
            { label: 'IIT Indore', image: '/speakes-at/iit-indore.png' },
            { label: 'JITO', image: '/speakes-at/jito.png' },
            { label: 'JCI', image: '/speakes-at/jci.png' },
            { label: 'ITM', image: '/speakes-at/itm-university.png' },
            { label: 'Chamber of Commerce', image: '/speakes-at/ccci.png' },
          ],
        },
      },
      {
        id: 'cmtjtmwdg0008b5xs3zpm4pv6',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'video_gallery',
        enabled: true,
        sortOrder: 3,
        data: {
          eyebrow: 'Workshop attendees share their experience',
          heading: 'Real people.',
          highlight: 'Real feedback.',
          description:
            'These are actual attendees who came to the workshop — hear it in their own words.',
          featured: {
            source: 'file',
            url: '/media/hero-intro.mp4',
            poster: '/media/cbdc6004a1938decb1073560ba53eca52b8d75db.bin',
          },
          items: [
            {
              name: 'Attendee 1',
              image: '/media/1434f4ca4ccf3676b9a0f36e0ae82577854f11d0.bin',
              video: {
                source: 'file',
                url: '/media/77a609b4dbbfa6f8aa32a6df3c82a0c505d8aa1d.bin',
                poster: '/media/1434f4ca4ccf3676b9a0f36e0ae82577854f11d0.bin',
              },
            },
            {
              name: 'Attendee 2',
              image: '/media/d842cf0108ff20dc3c2bf0a4051716d915e75aac.bin',
              video: {
                source: 'file',
                url: '/media/2ff24f7ba276866641d0be29820afd010ef40f7f.bin',
                poster: '/media/d842cf0108ff20dc3c2bf0a4051716d915e75aac.bin',
              },
            },
            {
              name: 'Attendee 3',
              image: '/media/1240d205e7cfd62bf485f704126c0b8fe4187826.bin',
              video: {
                source: 'file',
                url: '/media/9841a049251b1c1b1c4499bf0a8a0ee3d8bde7cd.bin',
                poster: '/media/1240d205e7cfd62bf485f704126c0b8fe4187826.bin',
              },
            },
            {
              name: 'Attendee 4',
              image: '/media/bdc6cd4178db5b587ccee2d28978aad93a6b7966.bin',
              video: {
                source: 'file',
                url: '/media/5e871ca6dd38263d53552fb445218ce675810a0f.bin',
                poster: '/media/bdc6cd4178db5b587ccee2d28978aad93a6b7966.bin',
              },
            },
          ],
        },
      },
      {
        id: 'cmtjtmwds000ab5xs1kl3b89i',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'cta',
        enabled: true,
        sortOrder: 4,
        data: {
          heading: 'See you',
          highlight: '',
          headingEnd: 'on 29th November',
          description: 'Reserve your seat for the Live session. Limited seats — register today.',
          seatsText: '23 seats remaining. Register now!',
          button: {
            label: 'Register Now →',
            url: 'https://rzp.io/rzp/hEo9sFF5',
          },
          note: '',
        },
      },
      {
        id: 'cmtjtmwe0000cb5xsz1ug09od',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'proof_impact',
        enabled: true,
        sortOrder: 5,
        data: {
          eyebrow: 'PROOF OF IMPACT',
          heading: 'Real Revenue.',
          highlight: 'Real Growth.',
          description: 'Attendees who applied what they learned — these are their actual results.',
          images: [
            {
              url: 'https://res.cloudinary.com/dldynfkhm/image/upload/v1788517675/aischoolraipur/images/b9eed1f4ef4f707ddadf99a01f943a4d_veys7s.webp',
              alt: 'Analytics dashboard showing gross sales',
            },
            {
              url: '/media/proof-youtube.png',
              alt: 'Earnings dashboard',
            },
          ],
        },
      },
      {
        id: 'cmtjtmwej000gb5xs1133jry9',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'audience',
        enabled: true,
        sortOrder: 7,
        data: {
          eyebrow: 'THIS IS FOR YOU IF',
          heading: "You're done with theory.",
          description:
            'This is built for doers who want to install AI into their business this week — not read another newsletter about it.',
          items: [
            { label: 'Founders growing 6-8 figure businesses' },
            { label: 'Solopreneurs & creators' },
            { label: 'Marketing & ops leaders' },
            { label: 'Agency owners' },
            { label: 'Recruiters & HR teams' },
            { label: 'Consultants & coaches' },
          ],
        },
      },
      {
        id: 'cmtjtmweq000ib5xsenn99ndv',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'photo_gallery',
        enabled: true,
        sortOrder: 8,
        data: {
          eyebrow: 'ON STAGE & BEYOND',
          heading: 'Moments with',
          highlight: 'Lakshit',
          categories: [
            {
              title: 'WORKSHOP PLACE',
              layout: 'landscape',
              images: [
                {
                  url: '/moments-with-lakshit/sharing-stage/img3.png',
                  alt: 'Speaking on stage at AI workshop',
                },
                {
                  url: '/moments-with-lakshit/sharing-stage/img2.png',
                  alt: 'Seated with workshop attendees',
                },
                {
                  url: '/moments-with-lakshit/workshop-place/img3.png',
                  alt: 'Conference hall stage',
                },
                {
                  url: '/moments-with-lakshit/workshop-place/img4.png',
                  alt: 'Live audience event',
                },
              ],
            },
            {
              title: 'SHARING STAGE',
              layout: 'portrait',
              images: [
                {
                  url: '/moments-with-lakshit/workshop-place/img2.png',
                  alt: 'Speaking with microphone at podium',
                },
                {
                  url: '/moments-with-lakshit/sharing-stage/img5.png',
                  alt: 'Live panel session on stage',
                },
                {
                  url: '/moments-with-lakshit/sharing-stage/img6.png',
                  alt: 'BBM 2025 stage moment',
                },
                {
                  url: '/moments-with-lakshit/achievements-and-awards/img5.png',
                  alt: 'Creator Commune stage meetup',
                },
              ],
            },
            {
              title: 'OFFLINE WORKSHOPS & TRAINING',
              layout: 'square',
              images: [
                {
                  url: '/moments-with-lakshit/offline-workshops-and-training/img1.png',
                  alt: 'Classroom group',
                },
                {
                  url: '/moments-with-lakshit/offline-workshops-and-training/img2.png',
                  alt: 'Training cohort',
                },
                {
                  url: '/moments-with-lakshit/offline-workshops-and-training/img3.png',
                  alt: 'Auditorium group',
                },
                {
                  url: '/moments-with-lakshit/offline-workshops-and-training/img4.png',
                  alt: 'Office workshop',
                },
              ],
            },
            {
              title: 'OFFLINE MEETUPS',
              layout: 'landscape',
              images: [
                {
                  url: '/moments-with-lakshit/offline-meetups-and-training/img1.png',
                  alt: 'Meetup applause',
                },
                {
                  url: '/moments-with-lakshit/offline-meetups-and-training/img2.png',
                  alt: 'Seminar seating',
                },
                {
                  url: '/moments-with-lakshit/offline-meetups-and-training/img3.png',
                  alt: 'Prompt workshop screen',
                },
                {
                  url: '/moments-with-lakshit/offline-meetups-and-training/img4.png',
                  alt: 'Classroom table',
                },
              ],
            },
            {
              title: 'AWARDED BY CHIEF MINISTER OF CHHATTISGARH',
              layout: 'featured',
              images: [
                {
                  url: '/moments-with-lakshit/awarded-by-chiefminister-of-chhattisgarh.png',
                  alt: 'Award ceremony',
                },
              ],
            },
            {
              title: 'ACHIEVEMENTS & AWARDS',
              layout: 'triple',
              images: [
                {
                  url: '/moments-with-lakshit/achievements-and-awards/img1.png',
                  alt: 'Trophy ceremony',
                },
                {
                  url: '/moments-with-lakshit/achievements-and-awards/img2.png',
                  alt: 'YouTube Creator Award',
                },
                {
                  url: '/moments-with-lakshit/achievements-and-awards/img4.png',
                  alt: 'YA Startup Award 2023',
                },
                {
                  url: '/moments-with-lakshit/achievements-and-awards/img3.png',
                  alt: 'Central India Connect Marketplace Award',
                },
                {
                  url: '/moments-with-lakshit/sharing-stage/img1.png',
                  alt: 'Grand Felicitation on stage',
                },
                {
                  url: '/moments-with-lakshit/sharing-stage/img4.png',
                  alt: 'Stage recognition with attendees',
                },
              ],
            },
          ],
        },
      },
      {
        id: 'cmtjtmwey000kb5xs78owibin',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'team',
        enabled: true,
        sortOrder: 9,
        data: {
          heading: 'MEET OUR TEAM',
          images: [
            { url: '/moments-with-lakshit/meet-our-team/img1.png', alt: 'Team in office' },
            { url: '/moments-with-lakshit/meet-our-team/img2.png', alt: 'Classroom team' },
          ],
        },
      },
      {
        id: 'cmtjtmwfc000mb5xsgxdv7yto',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'cta',
        enabled: true,
        sortOrder: 10,
        data: {
          heading: '',
          highlight: '',
          headingEnd: 'on 29th November',
          description: 'Reserve your seat for the Live session. Limited seats — register today.',
          seatsText: '23 seats remaining. Register now!',
          button: {
            label: 'Register Now →',
            url: 'https://rzp.io/rzp/hEo9sFF5',
          },
          note: '',
        },
      },
      {
        id: 'cmtjtmwfo000ob5xsq24edtwm',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'media_coverage',
        enabled: true,
        sortOrder: 11,
        data: {
          eyebrow: 'AS FEATURED IN',
          heading: 'Media',
          highlight: 'Coverage',
          description: 'Recognised across leading newspapers and magazines.',
          clippings: [
            {
              url: '/media-coverage/img1.png',
              alt: 'Hari Bhoomi newspaper coverage of Lakshit Sethiya AI workshop',
            },
            {
              url: '/media-coverage/img2.png',
              alt: 'Dainik Bhaskar newspaper coverage of Lakshit Sethiya AI workshop',
            },
          ],
        },
      },
      {
        id: 'cmtjtmwfy000qb5xs014w4i6v',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'whatsapp_feedback',
        enabled: true,
        sortOrder: 12,
        data: {
          eyebrow: 'STRAIGHT FROM ATTENDEES',
          heading: 'WhatsApp',
          highlight: 'feedback',
          description: 'Unfiltered messages from past attendees, days after the workshop.',
          messages: [
            {
              name: 'Naman Lodha',
              time: '10:42',
              text: 'Wonderful session. Note: This is written by me personally and not any AI tool.',
              screenshot: '/whatsapp-feedback/img1.png',
            },
            {
              name: 'Anurag Jain',
              time: '11:05',
              text: 'Thank you Lakshit for guidance in our unguided AI learning journey. Practical approach throughout.',
              screenshot: '/whatsapp-feedback/img2.png',
            },
            {
              name: 'Ruchi Jain',
              time: '18:21',
              text: 'Dear Lakshit Sir, thank you for the clarity, patience, and effort you put into teaching.',
              screenshot: '/whatsapp-feedback/img3.png',
            },
          ],
        },
      },
      {
        id: 'cmtjtmwg5000sb5xsscw816j4',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'faq',
        enabled: true,
        sortOrder: 13,
        data: {
          eyebrow: 'FAQ',
          heading: 'Common questions',
          faqIds: [
            'cmthabu1q0005aif72j8drjel',
            'cmthabu1q0006aif743uejt3m',
            'cmthabu1q0007aif7xqlck06n',
          ],
        },
      },
      {
        id: 'cmtjtmwga000ub5xsceuda0rw',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'contact_form',
        enabled: true,
        sortOrder: 14,
        data: {
          heading: 'Reserve your seat',
          description: 'Share your details and we will confirm your workshop seat.',
          submitLabel: 'Register Now →',
          successMessage: 'Thanks — we will contact you shortly.',
        },
      },
      {
        id: 'cmtjtmwgg000wb5xs3e3b7yp9',
        pageId: 'cmtjtmwbs0000b5xs4vvu1rtu',
        type: 'cta',
        enabled: true,
        sortOrder: 15,
        data: {
          heading: 'See you',
          highlight: '',
          headingEnd: 'on 29th November',
          description: 'Reserve your seat. Limited seats — register today.',
          seatsText: '23 seats remaining. Register now!',
          button: {
            label: 'Register Now →',
            url: 'https://rzp.io/rzp/hEo9sFF5',
          },
          note: '',
        },
      },
    ],
  },
  {
    id: 'cmthabu2t000faif7nl0xs0z6',
    name: 'AI Automation Masterclass (15 Business Ideas)',
    title: "Raipur's Most Advance AI & Automation Masterclass",
    slug: 'home',
    description: 'Live workshop by Lakshit Sethiya. Online via Zoom on 6th September.',
    status: 'PUBLISHED',
    seoTitle: "Raipur's Most Advance AI & Automation Masterclass — Lakshit Sethiya | 6 September",
    seoDescription:
      'A 3-hour Live Workshop by Lakshit Sethiya, Online via Zoom, that can change the way you do business.',
    seoKeywords: 'AI workshop, automation, Raipur, Lakshit Sethiya',
    ogTitle: "India's Most Advance AI & Automation Masterclass",
    ogDescription: 'Master 30+ AI tools in a 3-hour live workshop.',
    ogImage: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
    facebookPixelId: '',
    theme: 'classic',
    registerUrl: 'https://rzp.io/rzp/57Mrm3z',
    registerLabel: 'Register Now',
    eventStartsAt: '2026-11-15T11:00:00+05:30',
    updatedAt: '2026-09-04T06:30:05.202Z',
    domains: [],
    sections: [
      {
        id: 'cmthabu2z000haif732n467cn',
        pageId: 'cmthabu2t000faif7nl0xs0z6',
        type: 'hero',
        enabled: true,
        sortOrder: 0,
        data: {
          eyebrow: '1,000+ people attended in Raipur',
          heading: '15 Most Profitable',
          highlight: 'AI Business Ideas',
          headingEnd: 'Workshop',
          description:
            'A 3-hour Live Workshop by Lakshit Sethiya, Online via Zoom, that can change the way you do business.',
          video: {
            source: 'file',
            url: '/media/8036923a12fdf959fea2c6bd37a710b3d69c679b.bin',
            poster: '/media/c22c230db068ce61514bd9e868c89fc408d8ae43.bin',
          },
          alignment: 'center',
          pills: [
            { icon: 'calendar', label: '6th September' },
            { icon: 'clock', label: '11 AM to 2:00 PM' },
            { icon: 'pin', label: 'Aarambh Incubation Center' },
            { icon: 'users', label: 'Limited Seats' },
          ],
          originalPrice: '₹2000',
          price: '₹1500 only',
          seatsText: '17 seats remaining. Register now!',
          primaryButton: {
            label: 'Register Now →',
            url: 'https://rzp.io/rzp/57Mrm3z',
          },
          secondaryButton: { label: '', url: '' },
        },
      },
      {
        id: 'cmthabu36000jaif78g5n8ncx',
        pageId: 'cmthabu2t000faif7nl0xs0z6',
        type: 'icon_features',
        enabled: true,
        sortOrder: 1,
        data: {
          items: [
            { icon: 'spark', label: 'Learn 15 AI Business Ideas' },
            { icon: 'play', label: 'Live practical demo' },
            { icon: 'chat', label: 'Q&A Session' },
            { icon: 'video', label: 'Live Offline Workshop' },
          ],
        },
      },
    ],
  },
];
