import React, { useEffect, useRef, useState } from 'react';
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { DEFAULTS, PageSection } from '@/lib/data';
import {
  cmsApi,
  filterVisibleSections,
  resetAllCmsData,
  resolveAssetUrl,
  useAuth,
} from '@/lib/cms';
import { SectionRenderer } from '@/components/PublicSections';

const SECTION_TYPES = [
  'hero',
  'icon_features',
  'instructor',
  'video_gallery',
  'cta',
  'proof_impact',
  'workshop_tracks',
  'audience',
  'photo_gallery',
  'team',
  'media_coverage',
  'whatsapp_feedback',
  'faq',
  'contact_form',
  'text',
  'spacer',
];

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  text: 'Text',
  image: 'Image',
  image_text: 'Image + Text',
  video: 'Video',
  features: 'Features',
  stats: 'Stats',
  courses: 'Courses',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  gallery: 'Gallery',
  cta: 'Call to Action',
  contact_form: 'Contact Form',
  spacer: 'Spacer',
  icon_features: 'Icon Features',
  instructor: 'Instructor',
  video_gallery: 'Video Gallery',
  proof_impact: 'Proof of Impact',
  workshop_tracks: 'Workshop Tracks',
  audience: 'Audience',
  photo_gallery: 'Photo Gallery',
  team: 'Team',
  media_coverage: 'Media Coverage',
  whatsapp_feedback: 'WhatsApp Feedback',
};

const THEMES = [
  { key: 'classic', label: 'Classic' },
  { key: 'modern', label: 'Modern' },
  { key: 'bold', label: 'Bold' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'studio', label: 'Studio' },
];

export function AdminIcon({ name }: { name: string }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case 'pages':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'navigation':
      return (
        <svg {...props}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="14" y2="18" />
        </svg>
      );
    case 'media':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      );
    case 'courses':
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      );
    case 'testimonials':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
      );
    case 'faqs':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'leads':
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...props}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case 'preview':
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'delete':
      return (
        <svg {...props}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case 'save':
      return (
        <svg {...props}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      );
    case 'up':
      return (
        <svg {...props}>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      );
    case 'back':
      return (
        <svg {...props}>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case 'login':
      return (
        <svg {...props}>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      );
    case 'hide':
      return (
        <svg {...props}>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      );
    case 'show':
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );
  }
}

function AdminBrand({ login = false }: { login?: boolean }) {
  return (
    <div className={`admin-brand${login ? ' admin-brand--login' : ''}`} aria-label="AI School Raipur">
      <span className="admin-brand__mark" aria-hidden>
        AI
      </span>
      <div className="admin-brand__text">
        <strong>AI School Raipur</strong>
        <span>CONTENT STUDIO</span>
      </div>
    </div>
  );
}

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await login(String(fd.get('email') || ''), String(fd.get('password') || ''));
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <form className="login-card" onSubmit={handleSubmit}>
          <AdminBrand login />
          <h1>Welcome back</h1>
          <p className="muted">Sign in to manage landing pages (any email & password works locally)</p>
          <input
            className="admin-input"
            name="email"
            type="email"
            defaultValue="support@socialseller.in"
            placeholder="Email"
            required
          />
          <div className="password-field">
            <input
              className="admin-input password-field__input"
              name="password"
              type={showPass ? 'text' : 'password'}
              defaultValue="admin123"
              placeholder="Password"
              required
            />
            <button
              className="password-field__toggle"
              type="button"
              aria-label={showPass ? 'Hide password' : 'Show password'}
              onClick={() => setShowPass((v) => !v)}
            >
              <AdminIcon name={showPass ? 'hide' : 'show'} />
            </button>
          </div>
          <button className="admin-btn" type="submit">
            <AdminIcon name="login" /> Sign in
          </button>
        </form>
        <p className="login-attribution">
          {DEFAULTS.LOGIN_POWERED_BY_PREFIX}
          <a href={DEFAULTS.ATTRIBUTION_LINK_URL} target="_blank" rel="noreferrer">
            {DEFAULTS.ATTRIBUTION_LINK_LABEL}
          </a>
        </p>
      </div>
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
      { to: '/admin/pages', label: 'Landing Pages', icon: 'pages' },
      { to: '/admin/leads', label: 'Leads', icon: 'leads' },
      { to: '/admin/media', label: 'Media Library', icon: 'media' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { to: '/admin/faqs', label: 'FAQs', icon: 'faqs' },
      { to: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

export function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__head">
          <AdminBrand />
        </div>
        <nav className="admin-nav admin-nav--scroll" aria-label="Admin navigation">
          {NAV_GROUPS.map((g) => (
            <div key={g.label} className="admin-nav__group">
              <p className="admin-nav__label">{g.label}</p>
              {g.items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <AdminIcon name={it.icon} />
                  <span>{it.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <button
            className="admin-signout"
            type="button"
            onClick={() => logout().then(() => navigate('/admin/login'))}
          >
            <AdminIcon name="logout" /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__welcome">
            <h2>Welcome back, {user?.name || 'Admin'}</h2>
            <p>
              {location.pathname === '/admin'
                ? "Here's what's happening across your CMS."
                : 'AI School Raipur Content Studio'}
            </p>
          </div>
          <div className="admin-topbar__right">
            <div className="admin-topbar__actions">
              <Link className="ghost-btn ghost-btn--outline admin-btn--sm" to="/">
                <AdminIcon name="preview" /> View Live Site
              </Link>
              <Link className="admin-btn admin-btn--sm" to="/admin/pages">
                <AdminIcon name="pages" /> Landing Pages
              </Link>
              <button
                className="ghost-btn ghost-btn--danger admin-btn--sm"
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all CMS data back to live aischoolraipur.com defaults?')) {
                    resetAllCmsData();
                    window.location.reload();
                  }
                }}
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const pages = cmsApi.listPages();
  const leads = cmsApi.listLeads();
  const faqs = cmsApi.listFaqs();
  const publishedCount = pages.filter((p) => p.status === 'PUBLISHED').length;

  return (
    <div className="admin-page admin-page--dashboard">
      <div className="stats stats--row4">
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--blue">
            <AdminIcon name="pages" />
          </span>
          <div>
            <p className="stat-card__label">Total Pages</p>
            <p className="stat-card__value">{pages.length}</p>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--blue">
            <AdminIcon name="leads" />
          </span>
          <div>
            <p className="stat-card__label">Leads Captured</p>
            <p className="stat-card__value">{leads.length}</p>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--blue">
            <AdminIcon name="faqs" />
          </span>
          <div>
            <p className="stat-card__label">Published FAQs</p>
            <p className="stat-card__value">{faqs.length}</p>
          </div>
        </article>
        <article className="stat-card stat-card--accent">
          <div>
            <p className="stat-card__label">Published Pages</p>
            <p className="stat-card__value">{publishedCount}</p>
          </div>
          <span className="stat-card__icon stat-card__icon--accent">
            <AdminIcon name="pages" />
          </span>
        </article>
      </div>

      <div className="dash-panels">
        <article className="focus-panel">
          <div className="focus-panel__head">
            <div>
              <h3>Published Landing Pages</h3>
              <p>Click to edit or preview any landing page</p>
            </div>
            <Link className="focus-panel__link" to="/admin/pages">
              Open pages
            </Link>
          </div>
          <div className="focus-panel__list">
            {pages.map((p) => (
              <div key={p.id} className="dash-row">
                <Link to={`/admin/pages/${p.id}/edit`} style={{ fontWeight: 600 }}>
                  {p.name}
                </Link>
                <span className={`status ${p.status}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="focus-panel">
          <div className="focus-panel__head">
            <div>
              <h3>Recent Leads</h3>
              <p>Form submissions from the public website</p>
            </div>
            <Link className="focus-panel__link" to="/admin/leads">
              Review
            </Link>
          </div>
          {leads.length ? (
            <div className="focus-panel__list">
              {leads.slice(0, 4).map((l) => (
                <div key={l.id} className="dash-row">
                  <span>
                    {l.name} ({l.phone || l.email})
                  </span>
                  <span className={`status ${l.status}`}>{l.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="focus-panel__empty">
              <p>No leads submitted yet.</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export function AdminPagesList() {
  const navigate = useNavigate();
  const [pages, setPages] = useState(() => cmsApi.listPages());
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const reload = () => setPages(cmsApi.listPages({ search }));

  useEffect(() => {
    reload();
  }, [search]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const created = cmsApi.createPage({
      name: String(fd.get('name') || ''),
      slug: String(fd.get('slug') || ''),
      theme: String(fd.get('theme') || 'classic'),
      seoTitle: String(fd.get('seoTitle') || ''),
    });
    setCreateOpen(false);
    navigate(`/admin/pages/${created.id}/edit`);
  };

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <h1>Landing Pages</h1>
          <p className="admin-lede">Manage landing pages, themes, and sections.</p>
        </div>
        <button className="admin-btn" type="button" onClick={() => setCreateOpen(true)}>
          <AdminIcon name="plus" /> Add Landing Page
        </button>
      </div>

      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="search-field">
            <input
              className="admin-input"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Theme</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="table-page-cell">
                      <strong>{p.name}</strong>
                      <span>/{p.slug}</span>
                    </div>
                  </td>
                  <td>{p.theme || 'classic'}</td>
                  <td>{p.domains?.[0]?.hostname || '—'}</td>
                  <td>
                    <span className={`status ${p.status}`}>{p.status}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        className="ghost-btn ghost-btn--icon"
                        to={`/admin/pages/${p.id}/edit`}
                        aria-label="Edit"
                      >
                        <AdminIcon name="edit" />
                      </Link>
                      <Link
                        className="ghost-btn ghost-btn--icon"
                        to={`/admin/pages/${p.id}/preview`}
                        aria-label="Preview"
                      >
                        <AdminIcon name="preview" />
                      </Link>
                      <button
                        className="ghost-btn ghost-btn--icon ghost-btn--danger"
                        type="button"
                        aria-label="Delete"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.name}"?`)) {
                            cmsApi.deletePage(p.id);
                            reload();
                          }
                        }}
                      >
                        <AdminIcon name="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen ? (
        <div className="modal-back" onClick={() => setCreateOpen(false)}>
          <div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal__head">
              <h2>Create Landing Page</h2>
              <button
                className="ghost-btn ghost-btn--icon"
                type="button"
                onClick={() => setCreateOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="form-modal__body">
              <form id="create-page-form" className="admin-form" onSubmit={handleCreate}>
                <label>
                  <small>Page name *</small>
                  <input className="admin-input" name="name" required placeholder="Workshop Page" />
                </label>
                <label>
                  <small>Slug *</small>
                  <input className="admin-input" name="slug" required placeholder="workshop" />
                </label>
                <label>
                  <small>Theme</small>
                  <select className="admin-select" name="theme" defaultValue="classic">
                    {THEMES.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </form>
            </div>
            <div className="form-modal__foot">
              <button className="ghost-btn" type="button" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button className="admin-btn" type="submit" form="create-page-form">
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminPageEditor() {
  const { id = '' } = useParams();
  const [page, setPage] = useState(() => cmsApi.getPage(id));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  if (!page) {
    return (
      <div className="admin-page">
        <p className="error-message">Page not found</p>
      </div>
    );
  }

  const activeSection: PageSection | null =
    page.sections.find((s) => s.id === selectedId) || null;

  const updateMeta = (patch: Record<string, any>) => {
    const next = cmsApi.updatePage(page.id, patch);
    if (next) setPage(next);
    setToast('Saved changes');
    window.setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <h1>{page.name}</h1>
          <p className="muted">
            /{page.slug} · <span className={`status ${page.status}`}>{page.status}</span>
          </p>
        </div>
        <div className="admin-actions">
          <Link className="ghost-btn" to={`/admin/pages/${page.id}/preview`}>
            <AdminIcon name="preview" /> Preview
          </Link>
          <Link className="admin-btn" to="/">
            View Public Site
          </Link>
        </div>
      </div>

      {toast ? <p className="toast">{toast}</p> : null}

      <div className="admin-card editor-meta">
        <label>
          <small>Name</small>
          <input
            className="admin-input"
            defaultValue={page.name}
            onBlur={(e) => updateMeta({ name: e.target.value })}
          />
        </label>
        <label>
          <small>Title</small>
          <input
            className="admin-input"
            defaultValue={page.title}
            onBlur={(e) => updateMeta({ title: e.target.value })}
          />
        </label>
        <label>
          <small>Theme</small>
          <select
            className="admin-select"
            value={page.theme || 'classic'}
            onChange={(e) => updateMeta({ theme: e.target.value })}
          >
            {THEMES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <small>Countdown timer (ISO)</small>
          <input
            className="admin-input"
            defaultValue={page.eventStartsAt}
            onBlur={(e) => updateMeta({ eventStartsAt: e.target.value })}
          />
        </label>
        <label>
          <small>Register Now link</small>
          <input
            className="admin-input"
            defaultValue={page.registerUrl}
            onBlur={(e) => updateMeta({ registerUrl: e.target.value })}
          />
        </label>
        <label>
          <small>Register Now label</small>
          <input
            className="admin-input"
            defaultValue={page.registerLabel}
            onBlur={(e) => updateMeta({ registerLabel: e.target.value })}
          />
        </label>
      </div>

      <div className="builder">
        <div className="builder__col">
          <h3>Blocks</h3>
          <p className="builder__hint">Click to add a section</p>
          {SECTION_TYPES.map((type) => (
            <button
              key={type}
              className="block-btn"
              type="button"
              onClick={() => {
                const sec = cmsApi.addSection(page.id, type);
                setPage(cmsApi.getPage(page.id));
                if (sec) setSelectedId(sec.id);
              }}
            >
              <AdminIcon name="plus" /> {SECTION_LABELS[type] || type}
            </button>
          ))}
        </div>

        <div className="builder__col">
          <h3>Canvas</h3>
          <p className="builder__hint">Click a block to edit its JSON / properties</p>
          {page.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`section-row ${selectedId === sec.id ? 'active' : ''}`}
              onClick={() => setSelectedId(sec.id)}
            >
              <div className="section-row__info">
                <strong>{SECTION_LABELS[sec.type] || sec.type}</strong>
                <span className={`status ${sec.enabled ? 'PUBLISHED' : 'ARCHIVED'}`}>
                  {sec.enabled ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="admin-actions">
                <button
                  className="ghost-btn ghost-btn--icon"
                  type="button"
                  aria-label="Up"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (idx === 0) return;
                    const copy = [...page.sections];
                    const tmp = copy[idx];
                    copy[idx] = copy[idx - 1];
                    copy[idx - 1] = tmp;
                    updateMeta({ sections: copy });
                  }}
                >
                  <AdminIcon name="up" />
                </button>
                <button
                  className="ghost-btn ghost-btn--icon"
                  type="button"
                  aria-label="Toggle visibility"
                  onClick={(e) => {
                    e.stopPropagation();
                    cmsApi.updateSection(page.id, sec.id, { enabled: !sec.enabled });
                    setPage(cmsApi.getPage(page.id));
                  }}
                >
                  <AdminIcon name={sec.enabled ? 'hide' : 'show'} />
                </button>
                <button
                  className="ghost-btn ghost-btn--icon ghost-btn--danger"
                  type="button"
                  aria-label="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    cmsApi.deleteSection(page.id, sec.id);
                    setPage(cmsApi.getPage(page.id));
                  }}
                >
                  <AdminIcon name="delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="builder__col builder__col--props">
          <h3>Content</h3>
          {activeSection ? (
            <SectionJsonEditor
              key={activeSection.id}
              section={activeSection}
              onSave={(data) => {
                cmsApi.updateSection(page.id, activeSection.id, { data });
                setPage(cmsApi.getPage(page.id));
                setToast('Section updated');
                window.setTimeout(() => setToast(''), 1500);
              }}
            />
          ) : (
            <div className="builder__empty">
              <p>Select a section on the canvas to edit its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionJsonEditor({
  section,
  onSave,
}: {
  section: PageSection;
  onSave: (data: Record<string, any>) => void;
}) {
  const [raw, setRaw] = useState(() => JSON.stringify(section.data, null, 2));
  const [err, setErr] = useState('');

  return (
    <div className="admin-fields">
      <p className="builder__hint">{SECTION_LABELS[section.type] || section.type} · Edit properties</p>
      <textarea
        className="admin-textarea"
        rows={20}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      {err ? <p className="media-url-field__error">{err}</p> : null}
      <button
        className="admin-btn"
        type="button"
        onClick={() => {
          try {
            const parsed = JSON.parse(raw);
            setErr('');
            onSave(parsed);
          } catch {
            setErr('Invalid JSON format');
          }
        }}
      >
        <AdminIcon name="save" /> Save Section
      </button>
    </div>
  );
}

export function AdminPagePreview() {
  const { id = '' } = useParams();
  const page = cmsApi.getPage(id);
  const settings = cmsApi.getSettings();
  const related = {
    courses: cmsApi.listCourses(),
    testimonials: cmsApi.listTestimonials(),
    faqs: cmsApi.listFaqs(),
  };

  if (!page) return <p className="empty">Page not found</p>;

  return (
    <div className="preview-frame">
      <div className="preview-bar">
        <Link className="ghost-btn" to={`/admin/pages/${page.id}/edit`}>
          <AdminIcon name="back" /> Back to editor
        </Link>
        <p className="muted">Draft preview · {page.theme || 'classic'}</p>
      </div>
      <div className={`landing-theme theme-${page.theme || 'classic'}`}>
        {filterVisibleSections(page.sections || []).map((sec) => (
          <SectionRenderer
            key={sec.id}
            section={sec}
            theme={page.theme || 'classic'}
            related={related}
            sourcePage={page.slug}
            seatsRemaining={settings.seatsRemaining}
            registerUrl={page.registerUrl || settings.registerUrl}
            registerLabel={page.registerLabel || settings.registerLabel}
            onLeadSubmit={() => {}}
            leadStatus="idle"
          />
        ))}
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => cmsApi.getSettings());
  const [toast, setToast] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updated = cmsApi.updateSettings({
      websiteName: String(fd.get('websiteName') || ''),
      contactEmail: String(fd.get('contactEmail') || ''),
      phone: String(fd.get('phone') || ''),
      address: String(fd.get('address') || ''),
      homePageSlug: String(fd.get('homePageSlug') || ''),
      seatsRemaining: Number(fd.get('seatsRemaining') || 23),
      eventStartsAt: String(fd.get('eventStartsAt') || ''),
      registerUrl: String(fd.get('registerUrl') || ''),
      registerLabel: String(fd.get('registerLabel') || ''),
    });
    setSettings(updated);
    setToast('Settings saved.');
    window.setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="admin-page">
      <div>
        <h1>Settings</h1>
        <p className="admin-lede">Site identity, Register Now link, countdown timer, and contact info.</p>
      </div>
      {toast ? <p className="toast">{toast}</p> : null}
      <form className="admin-card admin-form-grid" onSubmit={handleSubmit}>
        <label>
          <small>Website name</small>
          <input className="admin-input" name="websiteName" defaultValue={settings.websiteName} />
        </label>
        <label>
          <small>Email</small>
          <input className="admin-input" name="contactEmail" defaultValue={settings.contactEmail} />
        </label>
        <label>
          <small>Phone</small>
          <input className="admin-input" name="phone" defaultValue={settings.phone} />
        </label>
        <label>
          <small>Home page slug</small>
          <input className="admin-input" name="homePageSlug" defaultValue={settings.homePageSlug} />
        </label>
        <label className="span-2">
          <small>Address</small>
          <textarea className="admin-textarea" name="address" defaultValue={settings.address} />
        </label>
        <label>
          <small>Seats remaining</small>
          <input
            className="admin-input"
            name="seatsRemaining"
            type="number"
            defaultValue={settings.seatsRemaining}
          />
        </label>
        <label>
          <small>Event starts at (countdown timer)</small>
          <input className="admin-input" name="eventStartsAt" defaultValue={settings.eventStartsAt} />
        </label>
        <label>
          <small>Register Now button link</small>
          <input className="admin-input" name="registerUrl" defaultValue={settings.registerUrl} />
        </label>
        <label>
          <small>Register Now button text</small>
          <input className="admin-input" name="registerLabel" defaultValue={settings.registerLabel} />
        </label>
        <div className="span-2">
          <button className="admin-btn" type="submit">
            <AdminIcon name="save" /> Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminFaqsPage() {
  const [faqs, setFaqs] = useState(() => cmsApi.listFaqs());
  const [open, setOpen] = useState(false);

  const reload = () => setFaqs(cmsApi.listFaqs());

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    cmsApi.createFaq({
      question: String(fd.get('question') || ''),
      answer: String(fd.get('answer') || ''),
      category: 'general',
      status: 'PUBLISHED',
      sortOrder: faqs.length + 1,
    });
    setOpen(false);
    reload();
  };

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <h1>FAQs</h1>
          <p className="admin-lede">Manage Common questions on the landing page.</p>
        </div>
        <button className="admin-btn" type="button" onClick={() => setOpen(true)}>
          <AdminIcon name="plus" /> Add FAQ
        </button>
      </div>
      <div className="table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((f) => (
                <tr key={f.id}>
                  <td>
                    <strong>{f.question}</strong>
                  </td>
                  <td>{f.answer}</td>
                  <td>
                    <span className={`status ${f.status}`}>{f.status}</span>
                  </td>
                  <td>
                    <button
                      className="ghost-btn ghost-btn--icon ghost-btn--danger"
                      type="button"
                      onClick={() => {
                        cmsApi.deleteFaq(f.id);
                        reload();
                      }}
                    >
                      <AdminIcon name="delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open ? (
        <div className="modal-back" onClick={() => setOpen(false)}>
          <div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal__head">
              <h2>Add FAQ</h2>
              <button className="ghost-btn ghost-btn--icon" type="button" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <div className="form-modal__body">
              <form id="faq-form" className="admin-form" onSubmit={handleCreate}>
                <label>
                  <small>Question *</small>
                  <input className="admin-input" name="question" required />
                </label>
                <label>
                  <small>Answer *</small>
                  <textarea className="admin-textarea" name="answer" rows={4} required />
                </label>
              </form>
            </div>
            <div className="form-modal__foot">
              <button className="ghost-btn" type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="admin-btn" type="submit" form="faq-form">
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminTestimonialsPage() {
  const [items, setItems] = useState(() => cmsApi.listTestimonials());
  const reload = () => setItems(cmsApi.listTestimonials());

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <h1>Testimonials</h1>
          <p className="admin-lede">Quotes shown in testimonial sections on published pages.</p>
        </div>
      </div>
      <div className="table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Quote</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.name}</strong>
                  </td>
                  <td>{t.designation || '—'}</td>
                  <td>{t.quote}</td>
                  <td>
                    <button
                      className="ghost-btn ghost-btn--icon ghost-btn--danger"
                      type="button"
                      onClick={() => {
                        cmsApi.deleteTestimonial(t.id);
                        reload();
                      }}
                    >
                      <AdminIcon name="delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState(() => cmsApi.listLeads());
  const reload = () => setLeads(cmsApi.listLeads());

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <h1>Leads</h1>
          <p className="admin-lede">Form submissions from the public website.</p>
        </div>
      </div>
      <div className="table-card">
        {leads.length === 0 ? <p className="empty">No leads yet.</p> : null}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Status</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.name}</strong>
                  </td>
                  <td>{l.email}</td>
                  <td>{l.phone}</td>
                  <td>{l.message || '—'}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={l.status}
                      onChange={(e) => {
                        cmsApi.updateLeadStatus(l.id, e.target.value as any);
                        reload();
                      }}
                    >
                      <option>NEW</option>
                      <option>CONTACTED</option>
                      <option>QUALIFIED</option>
                      <option>CONVERTED</option>
                      <option>CLOSED</option>
                    </select>
                  </td>
                  <td>{l.sourcePage || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminMediaPage() {
  const [files, setFiles] = useState(() => cmsApi.listMedia());
  const inputRef = useRef<HTMLInputElement | null>(null);

  const reload = () => setFiles(cmsApi.listMedia());

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await cmsApi.uploadMedia(file);
    reload();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <h1>Media library</h1>
          <p className="admin-lede">Upload images and video files for use in landing page sections.</p>
        </div>
        <span className="media-count">{files.length} files</span>
      </div>
      <div className="table-card media-library">
        <div
          className="media-upload-zone"
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
        >
          <span className="media-upload-zone__icon">
            <AdminIcon name="media" />
          </span>
          <strong>Drop files here or click to upload</strong>
          <p className="muted">PNG, JPG, WebP · Stored locally</p>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </div>
        <div className="media-grid media-grid--enhanced">
          {files.map((f) => (
            <article key={f.id} className="media-card">
              <div className="media-card__preview">
                <img src={resolveAssetUrl(f.url)} alt={f.originalFilename} loading="lazy" />
              </div>
              <div className="media-card__body">
                <strong>{f.originalFilename}</strong>
                <span>{(f.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="media-card__actions">
                <button
                  className="ghost-btn ghost-btn--icon ghost-btn--danger"
                  type="button"
                  onClick={() => {
                    cmsApi.deleteMedia(f.id);
                    reload();
                  }}
                >
                  <AdminIcon name="delete" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
