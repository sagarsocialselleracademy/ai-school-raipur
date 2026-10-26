import React from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { LandingView } from '@/pages/LandingView';
import {
  AdminDashboardPage,
  AdminFaqsPage,
  AdminLayout,
  AdminLeadsPage,
  AdminLoginPage,
  AdminMediaPage,
  AdminPageEditor,
  AdminPagePreview,
  AdminPagesList,
  AdminSettingsPage,
  AdminTestimonialsPage,
} from '@/pages/AdminPages';

function DynamicSlugView() {
  const { slug } = useParams();
  return <LandingView slug={slug} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
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
