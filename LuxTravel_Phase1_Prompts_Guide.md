# LuxTravel - Phase 1: Prompts Guide
## Step-by-Step Prompts for Claude Code + Cursor

---

## 📌 How to Use This Document

1. **Start with Prompt 0** - This gives Claude your entire React code ONCE
2. Execute remaining prompts in order (Prompt 1, then Prompt 2, etc.)
3. Claude will remember the code throughout the session
4. Test after each major section

---

## 🎨 PROMPT 0: Give Claude Your React Code (DO THIS FIRST!)

**Run this prompt FIRST before anything else. This gives Claude your entire codebase to reference throughout the project.**

```
I'm building a Next.js website for LuxTravel, a bus tour company. I have an existing React app that I want to convert to Next.js with Supabase backend.

Please save this code as reference - I'll ask you to convert different components in upcoming prompts.

KEY MODIFICATIONS NEEDED (apply these when I ask you to convert components):
1. REMOVE: BookingBar component (not needed for Phase 1)
2. CHANGE navigation: From ['The Fleet', 'Destinations', 'Private Charter', 'Concierge'] to ['Home', 'Buses'] + Language Switcher (EN/KA/RU)
3. CHANGE features list: From fake amenities to real ones:
   - WiFi Connectivity
   - Air Conditioning
   - USB Charging Ports
   - Comfortable Seating
   - Onboard Toilet
   - Entertainment System
   - Refreshments Available
4. ADD to Hero: "Contact Us" CTA button (instead of BookingBar)
5. CHANGE footer links: To Home, Buses, Facebook, Instagram, TikTok + contact info
6. ADD new sections: Gallery, Contact Form (I'll provide specs later)

Here is my complete React code:

[PASTE YOUR ENTIRE react-app.js FILE HERE]

Please confirm you have saved this code and understand the modifications needed. Then I'll proceed with the Next.js setup prompts.
```

---

## 🚀 PHASE A: Project Setup

### Prompt 1: Initialize Next.js Project

```
Create a new Next.js 14 project called "luxtravel" with the following configuration:
- Use App Router
- TypeScript enabled
- Tailwind CSS: NO (we will use custom CSS from the React code I shared)
- ESLint enabled
- src/ directory: NO (use app/ directly)
- Import alias: @/*

Install these additional dependencies:
- @supabase/supabase-js
- @supabase/ssr
- next-intl (for internationalization)
- lucide-react (for icons)
- framer-motion (for animations)

Create the folder structure:
/app
/components
/lib
/messages
/styles
/types
/public
```

---

### Prompt 2: Setup Supabase Configuration

```
Create the Supabase configuration files for the LuxTravel project:

1. Create /lib/supabase/client.ts - Browser client
2. Create /lib/supabase/server.ts - Server client for Server Components
3. Create /lib/supabase/middleware.ts - For auth middleware

Also create a /types/index.ts file with TypeScript interfaces for:
- Bus (id, name, class, capacity, description_en, description_ka, description_ru, amenities, photos, is_active, maintenance_status, created_at, updated_at)
- SiteContent (id, key, value_en, value_ka, value_ru, image_url)
- GalleryImage (id, image_url, alt_text_en, alt_text_ka, alt_text_ru, sort_order)
- Setting (id, key, value)
- ContactMessage (id, name, email, message, is_read, created_at)

Use environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
```

---

### Prompt 3: Create Database Schema in Supabase

```
Generate the complete SQL commands to create the LuxTravel database schema in Supabase:

Tables needed:
1. buses - id, name, class, capacity, description_en/ka/ru, amenities (JSONB), photos (TEXT[]), is_active, maintenance_status, timestamps
2. site_content - id, key (unique), value_en/ka/ru, image_url, timestamps
3. gallery - id, image_url, alt_text_en/ka/ru, sort_order, created_at
4. settings - id, key (unique), value, timestamps
5. contact_messages - id, name, email, message, is_read, created_at

Also include:
- Row Level Security policies
- Storage buckets: bus-images, gallery, site-assets
- Default data inserts for site_content and settings
```

---

### Prompt 4: Setup Global Styles

```
Using the React code I shared earlier, extract all styles and create /styles/globals.css

Include:
1. CSS variables:
   - --color-void: #050505
   - --color-void-deep: #000000
   - --color-diamond: #F0F2F5
   - --color-silver: #A0A0A0
   - --color-lip-red: #B8182F
   - --font-geo: 'Montserrat', sans-serif
   - --font-serif: 'Cormorant Garamond', serif

2. Base styles (reset, body, typography)

3. Animations (fadeIn with delay classes)

4. Utility classes for common patterns

Also update app/layout.tsx to:
- Use next/font for Montserrat and Cormorant Garamond
- Import globals.css
- Set metadata
```

---

### Prompt 5: Setup Internationalization

```
Setup next-intl for 3 languages: English (en), Georgian (ka), Russian (ru).

Create:
1. /messages/en.json - All UI text in English
2. /messages/ka.json - Georgian translations (ქართული)
3. /messages/ru.json - Russian translations

Include translations for:
- navigation (home, buses)
- hero section
- fleet section
- amenities (wifi, ac, usb, toilet, tv, refreshments, comfortable seating)
- contact form
- footer
- common terms

Also create:
- /i18n.ts configuration
- middleware.ts for locale routing
- LanguageSwitcher component
- Update folder structure: /app/[locale]/...
```

---

## 🎨 PHASE B: Public Components

### Prompt 6: Convert All Public Components

```
Using the React code I shared in Prompt 0, convert ALL public components to Next.js.

Create these files:
1. /components/public/Header.tsx - From Header component
   - Change nav to ['Home', 'Buses'] + LanguageSwitcher
   - Add mobile hamburger menu
   - Use next/link

2. /components/public/Hero.tsx - From Hero component
   - REMOVE BookingBar
   - ADD "Contact Us" button that scrolls to #contact
   - Accept props for dynamic content (title, subtitle, backgroundImage)

3. /components/public/FleetSection.tsx - From Fleet component
   - Accept buses array prop
   - Use responsive grid (3/2/1 columns)

4. /components/public/BusCard.tsx - From FleetCard component
   - Accept props: id, name, busClass, capacity, imageUrl
   - Link to /[locale]/buses/[id]
   - Use next/image

5. /components/public/WhyChooseUs.tsx - From Showcase + FeatureList
   - CHANGE features to real amenities (WiFi, AC, USB, Seating, Toilet, Entertainment, Refreshments)
   - Accept props for dynamic content

6. /components/public/Footer.tsx - From Footer component
   - Change links to: Home, Buses, Facebook, Instagram, TikTok
   - Add contact info row
   - Add copyright

Keep ALL styling, hover effects, and animations from the original React code.
Make all components responsive.
Use 'use client' directive where needed for interactivity.
Use next-intl for translations.
```

---

### Prompt 7: Create Gallery Section (NEW)

```
Create /components/public/Gallery.tsx - This is a NEW section not in the original React code.

Match the existing design system (colors, typography, spacing from the React code I shared).

Design:
- Same section padding as Fleet (120px 40px)
- Section header same style (tag + title + skewed line)
- 4-column grid (similar to Fleet grid style)
- Images with grayscale filter, color on hover
- Lightbox on click

Accept images array prop from Supabase gallery table.
```

---

### Prompt 8: Create Contact Section (NEW)

```
Create /components/public/ContactSection.tsx - NEW section matching existing design.

Design:
- ID="contact" for anchor linking
- 2-column layout (info left, form right)
- Contact info: Phone, Email, Address, WhatsApp
- Social icons: Facebook, Instagram, TikTok
- Form: Name, Email, Message, Submit button

Style inputs and button to match the luxury aesthetic from the React code.
Form submits to /api/contact.
Use lucide-react for icons.
```

---

## 📄 PHASE C: Pages

### Prompt 9: Create All Public Pages

```
Create all public pages for LuxTravel:

1. /app/[locale]/page.tsx - Homepage
   - Fetch data from Supabase (site_content, buses, gallery, settings)
   - Render: Hero, FleetSection, WhyChooseUs, Gallery, ContactSection
   - Add SEO metadata

2. /app/[locale]/buses/page.tsx - Fleet listing
   - Hero banner with "Our Fleet" title
   - Filter buttons (All, Standard, Premium, VIP)
   - Grid of all buses using BusCard
   - Client-side filtering

3. /app/[locale]/buses/[id]/page.tsx - Bus detail
   - Hero with bus image
   - Photo gallery
   - Specifications
   - Amenities grid
   - CTA button
   - Related buses

4. /app/[locale]/layout.tsx - Public layout with Header

Add generateStaticParams for bus pages.
Add proper metadata for SEO.
```

---

## 👤 PHASE D: Admin Dashboard

### Prompt 10: Create Admin Authentication

```
Create admin authentication with Supabase:

1. /app/admin/login/page.tsx
   - Login form (email, password)
   - LuxTravel branding
   - Supabase signInWithPassword

2. /app/admin/layout.tsx
   - Check authentication
   - Redirect if not logged in
   - Include Sidebar

3. /components/admin/Sidebar.tsx
   - Navigation: Dashboard, Buses, Content, Gallery, Settings, Logout
   - Active state styling
   - Collapsible on mobile

4. middleware.ts - Protect /admin/* routes
```

---

### Prompt 11: Create Admin Dashboard and Bus Management

```
Create admin pages:

1. /app/admin/page.tsx - Dashboard
   - Stats cards (total buses, active, maintenance, gallery images, unread messages)
   - Recent messages list
   - Quick action buttons

2. /app/admin/buses/page.tsx - Bus management
   - Table of all buses
   - Add/Edit/Delete functionality
   - Image upload to Supabase Storage

3. /components/admin/BusForm.tsx
   - All bus fields (name, class, capacity, descriptions, amenities, photos)
   - Image upload component
   - Validation
```

---

### Prompt 12: Create Content, Gallery, and Settings Management

```
Create remaining admin pages:

1. /app/admin/content/page.tsx
   - Edit hero section (title, subtitle, image) in all 3 languages
   - Edit why choose us section in all 3 languages
   - Image upload for section images

2. /app/admin/gallery/page.tsx
   - Upload images
   - Grid view with delete/edit
   - Drag-drop reordering
   - Alt text in 3 languages

3. /app/admin/settings/page.tsx
   - Contact info (phone, email, address, whatsapp)
   - Social media URLs (facebook, instagram, tiktok)
```

---

## 🔌 PHASE E: API and Polish

### Prompt 13: Create API and Final Polish

```
Create API routes and final polish:

1. /app/api/contact/route.ts
   - Handle contact form POST
   - Validate inputs
   - Save to Supabase contact_messages

2. Loading and Error states
   - /app/[locale]/loading.tsx
   - /app/[locale]/error.tsx
   - /app/[locale]/not-found.tsx

3. SEO
   - /app/sitemap.ts
   - /app/robots.ts
   - Metadata for all pages

4. Responsive design check
   - Test all components on mobile/tablet/desktop
   - Fix any responsive issues
```

---

### Prompt 14: Testing and Deployment

```
Final testing and deployment prep:

1. Create .env.example with required variables

2. Testing checklist - verify:
   - All pages load
   - All 3 languages work
   - Forms submit correctly
   - Admin CRUD works
   - Images upload
   - Responsive on all devices

3. Build and test:
   npm run build
   npm run start

4. Create README.md with setup instructions

5. Deploy to Vercel:
   - Connect GitHub
   - Add env variables
   - Deploy
```

---

## ✅ Summary Checklist

| Phase | Prompts | What's Created |
|-------|---------|----------------|
| **Setup** | 0-5 | React code reference, Next.js project, Supabase, styles, i18n |
| **Components** | 6-8 | All public components (Header, Hero, Fleet, WhyChooseUs, Gallery, Contact, Footer) |
| **Pages** | 9 | Homepage, Buses page, Bus detail page |
| **Admin** | 10-12 | Auth, Dashboard, Bus/Content/Gallery/Settings management |
| **Polish** | 13-14 | API, loading states, SEO, deployment |

**Total: 15 prompts** (including Prompt 0)

---

## 📝 Quick Tips

- Run **Prompt 0 FIRST** - gives Claude your entire React code
- Claude will remember the code for the whole session
- If Claude forgets, just say "refer to the React code I shared in Prompt 0"
- Test after each Phase before moving on

---

*Document Version: 2.0*
*Total Prompts: 15*
*Estimated Time: 2-3 weeks*
