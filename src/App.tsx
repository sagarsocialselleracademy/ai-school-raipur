import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { LandingView } from '@/pages/LandingView';

// Lazy-load Admin CMS routes so regular landing page visitors download 0 admin code
const AdminLoginPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminLoginPage })));
const AdminLayout = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminDashboardPage })));
const AdminPagesList = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminPagesList })));
const AdminPageEditor = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminPageEditor })));
const AdminPagePreview = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminPagePreview })));
const AdminSettingsPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminSettingsPage })));
const AdminFaqsPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminFaqsPage })));
const AdminTestimonialsPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminTestimonialsPage })));
const AdminLeadsPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminLeadsPage })));
const AdminMediaPage = lazy(() => import('@/pages/AdminPages').then((m) => ({ default: m.AdminMediaPage })));

function DynamicSlugView() {
  const { slug } = useParams();
  return <LandingView slug={slug} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={null}>
              <AdminLoginPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="pages" element={<AdminPagesList />} />
          <Route path="pages/:id/edit" element={<AdminPageEditor />} />
          <Route path="pages/:id/preview" element={<AdminPagePreview />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="seo" element={<AdminSettingsPage />} />
          <Route path="faqs" element={<AdminFaqsPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="media" element={<AdminMediaPage />} />
        </Route>
        <Route path="/:slug" element={<DynamicSlugView />} />
        <Route path="*" element={<LandingView />} />
      </Routes>
    </BrowserRouter>
  );
}
