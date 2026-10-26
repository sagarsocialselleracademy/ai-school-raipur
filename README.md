# AI School Raipur (Complete Clone)

Complete React + Vite + TypeScript clone of [aischoolraipur.com](https://aischoolraipur.com/), including the full landing page, all media assets, video testimonials, categorized photo galleries, newspaper coverage, WhatsApp reviews, and the Content Studio Admin CMS.

## Getting Started

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Or double-click `start-website.bat` to open at `http://localhost:5174`.

2. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Routes

- `/` — **AI School Raipur Landing Page** (`Raipur's Most Advance AI Agents Masterclass`):
  - Sticky countdown topbar with remaining seats & CTA
  - Hero section with badge pill, event pills, Wistia intro video player, pricing pill, and CTA
  - 4 Icon Feature tiles (`Master 20+ Ai Tools`, `Live practical demo`, `Q&A Session`, `Snacks included`)
  - Instructor card (`Lakshit Sethiya`) & 6 Speaker institution badges (`IIM Nagpur`, `IIT Indore`, `JITO`, `JCI`, `ITM`, `Chamber of Commerce`)
  - Video Gallery with 8 attendee video testimonials + featured horizontal video
  - Proof of Impact revenue & growth dashboards
  - Audience section (`You're done with theory.`)
  - Categorized Photo Gallery (`Moments with Lakshit`: Workshop Place, Sharing Stage, Offline Workshops & Training, Offline Meetups, Awarded by Chief Minister of Chhattisgarh, Achievements & Awards)
  - Meet Our Team section
  - Media Coverage newspaper mosaic
  - WhatsApp Feedback phone cards
  - Interactive FAQ accordion
  - Lead capture registration form (redirects to WhatsApp confirmation)
  - Full footer + scroll-to-top button
- `/home` — Alternate published landing page (`15 Most Profitable AI Business Ideas Workshop`)
- `/admin/login` & `/admin` — **Content Studio Admin CMS**:
  - Dashboard, Landing Page Visual/JSON Builder, FAQs, Testimonials, Leads, Media Library, and Site Settings (persisted in `localStorage` with one-click reset to defaults).
