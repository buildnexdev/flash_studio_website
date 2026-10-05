# PhotoLab Studio — Official Website

This folder (`website/`) contains the complete, standalone, production-ready website implementation for **PhotoLab Studio**.

---

## 📂 Architecture & Folder Structure

```text
website/
├── public/                     # Static assets (favicons, photography samples)
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── assets/                 # Reusable vector icons and graphical assets
│   ├── components/             # Reusable UI & form building blocks
│   │   ├── BookingFields.tsx   # Typed event booking form fields
│   │   ├── data.tsx            # Loading, Error, Empty & Query states
│   │   ├── form.tsx            # Accessible Inputs, Textareas, Selects
│   │   └── ui.tsx              # Buttons, Badges, Alerts, Spinners
│   ├── data/                   # Navigation maps & graceful fallback data
│   │   ├── fallbackData.ts     # Authentic studio defaults (never shows broken state)
│   │   └── navigation.ts       # Main navigation and footer links
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.tsx         # User session & permission verification
│   │   ├── useSeo.ts           # Dynamic title, Open Graph & meta tags
│   │   ├── useSite.ts          # Studio site data query hook
│   │   └── useToast.tsx        # Toast notification system
│   ├── layouts/                # Page layouts
│   │   └── PublicLayout.tsx    # Header, navigation, top bar & footer
│   ├── pages/                  # Public website pages
│   │   ├── About.tsx           # Studio philosophy, team & statistics
│   │   ├── Book.tsx            # Session reservation & inquiry submission
│   │   ├── Contact.tsx         # Studio coordinates & direct contact form
│   │   ├── GalleryFinder.tsx   # Event QR code / pass-token lookup
│   │   ├── Home.tsx            # Hero, services, experience, packages, portfolio
│   │   ├── NotFound.tsx        # Styled 404 error page
│   │   ├── Packages.tsx        # Pricing, features & bespoke quote banner
│   │   ├── Portfolio.tsx       # Filterable gallery & accessible lightbox
│   │   ├── QrGallery.tsx       # Live event guest gallery viewer
│   │   ├── RouteError.tsx      # Route-level error boundary
│   │   └── Services.tsx        # Service offerings & package links
│   ├── sections/               # Modular website sections
│   │   ├── CtaSection.tsx      # Closing conversion call to action
│   │   ├── ExperienceSection.tsx # Real-time QR live gallery highlights
│   │   ├── HeroSection.tsx     # Hero banner with verified metrics
│   │   ├── PackageCard.tsx     # Package investment cards
│   │   ├── PageHero.tsx        # Subpage hero banners
│   │   ├── PortfolioGrid.tsx   # Masonry-style portfolio showcase
│   │   ├── Section.tsx         # Standardized semantic section wrapper
│   │   └── TestimonialCard.tsx # Star ratings & client reflections
│   ├── services/               # API layer
│   │   ├── api.ts              # Fetch wrapper, error formatting, tokens
│   │   └── siteService.ts      # Public site endpoints
│   ├── utils/                  # Utility functions
│   │   ├── cn.ts               # Classname concatenator
│   │   ├── format.ts           # Currency (INR), date & number formatting
│   │   └── validation.ts       # Zod schemas for booking & contact forms
│   ├── App.tsx                 # Providers & routing root
│   ├── index.css               # Tailwind CSS v4 design system
│   ├── main.tsx                # Client entrypoint
│   ├── routes.tsx              # React Router v7 configuration
│   └── vite-env.d.ts           # TypeScript environment typing
├── index.html                  # SEO & OpenGraph meta tags
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite server & proxy configuration
```

---

## 🚀 Getting Started

### 1. Installation

From the `website/` directory:

```bash
npm install
```

### 2. Running the Development Server

```bash
npm run dev
```

The website starts at `http://localhost:5174` (or your configured port).
API requests to `/api` are automatically proxied to the backend at `http://localhost:4000` (or `VITE_DEV_API_TARGET`).

### 3. Production Build

To test and compile the production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 SEO & Social Metadata

Every page dynamically sets:
- Unique, descriptive page title (`<title>`)
- Meta description (`<meta name="description">`)
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Relevant search keywords
- Semantic HTML5 headings (`H1`, `H2`, `H3`)
- Accessibility labels and `alt` attributes on all imagery

---

## 🎨 Design & Copywriting Highlights

- **Professional Copywriting**: Rewritten throughout into clear, refined, natural English without changing original business meanings.
- **No Hallucinated Data**: Retains genuine studio parameters and verified statistics without fabricating fake certifications or awards.
- **Graceful Fallbacks**: If the backend API is disconnected or starting up, the site automatically renders baseline studio data rather than breaking or showing blank screens.
- **Live QR Guest Galleries**: Supports `/gallery` lookup and direct token access (`/g/:token`) for event attendees.
