TRUST BRICKS PROPERTIES LTD — SYSTEM CONTEXT & BLUEPRINT

Version: 1.1 | Status: Phase 2.5 (Motion & Secondary Components)
Slogan: "Teamwork Makes The Dream Work"
Core Job: Convert Nigerian professionals into PenCom mortgage leads.

1. TECH STACK & ENV

Framework: Next.js (App Router), React, TypeScript.

Config: Turbopack enabled (turbopack: { root: __dirname }).

Styling & Motion: Tailwind CSS, Framer Motion (UI UX PRO MAX standard).

Backend/DB: PostgreSQL (via Docker/Coolify), API Routes.

Routing Engine: Edge-based state distribution logic.

2. DESIGN TOKENS (STRICT)

Colors:

Primary Navy: #0D1F3C (Hover: #162E57)

Action Orange: #E8600A (Hover: #D4530A)

Semantic: Gold #B8952A (PenCom badges), Ice Blue #F0F4F9 (Body Bg).

Typography:

Display: Plus Jakarta Sans (Weights: 600, 700, 800)

Body: Inter (Weights: 400, 500). Tabular nums (tnum) for ₦ figures.

Motion Physics (Super Premium):

Spring-heavy. Standard: stiffness: 280, damping: 28.

Staggered entrances for all grid layouts.

Scroll-linked parallax effects for hero and background elements.

Magnetic hover effects on all Action Orange CTAs.

3. BUSINESS LOGIC & MULTI-STATE ROUTING

Office Hubs: Abuja, Lagos, Adamawa, Kaduna.
PFA Minimum Thresholds (Strict Validation):

Stanbic IBTC: ₦5,000,000

GT Pension: ₦1,000,000

Citizens Pensions: Tier 1 (₦500,000) / Tier 2 (₦200,000)

Trustfund, NUPEMCO, Tangerine APT, Norrenberger, NLPC, Premium, AccessARM, Leadway Pensure, Oak: ₦500,000.

4. CURRENT PROGRESS STATUS

[x] GlobalNavbar: Sticky, glassmorphism, responsive.

[x] HeroSection: Split layout, CTA, stats card.

[x] EligibilityFunnel: Full 5-step modal, all 13 PFA thresholds enforced.

[ ] TrustMarquee: Infinite scrolling PenCom/Bank logos.

[ ] HowItWorks: 3-step grid with hover-lift borders.

[ ] MortgageCalculator: Dynamic RSA vs Property Value sliders.

[ ] OfficeLocator: 4-state interactive grid.

[ ] WhatsAppWidget: Floating, state-aware routing.

5. NEXT OBJECTIVE: "SUPER PREMIUM MOTION"

The UI must feel expensive.

Elements should NOT just fade in. They must slide, spring, and stagger.

Use useScroll and useTransform from Framer Motion to map scroll position to Y-axis movement (Parallax).

Use whileInView with viewport={{ once: true, margin: "-100px" }} for buttery smooth scroll reveals.

TRUST BRICKS PROPERTIES LTD — SYSTEM CONTEXT & BLUEPRINT

Version: 1.2 | Status: Phase 3 (Backend & Multi-State Routing)
Slogan: "Teamwork Makes The Dream Work"
Core Job: Convert Nigerian professionals into PenCom mortgage leads.

1. TECH STACK & ENV

4. CURRENT PROGRESS STATUS

[x] GlobalNavbar: Sticky, glassmorphism, responsive.

[x] HeroSection: Split layout, CTA, stats card.

[x] EligibilityFunnel: Full 5-step modal, all 13 PFA thresholds enforced.

[x] TrustMarquee: Infinite scrolling PenCom/Bank logos.

[x] HowItWorks: 3-step grid with hover-lift borders.

[x] MortgageCalculator: Dynamic RSA vs Property Value sliders.

[x] Footer & OfficeLocator: Full legal and regional layout.

[ ] Database Setup: PostgreSQL via Docker/Prisma ORM.

[ ] Routing Engine: Next.js Server Actions for lead ingestion.

5. NEXT OBJECTIVE: "POSTGRESQL & ROUTING ENGINE"

The focus shifts to the backend.

Setup a local Dockerized PostgreSQL instance matching the Coolify production environment.

Implement Prisma ORM to map the branches, pfa_rules, and leads schemas.

Build the Next.js Server Action (submitLead) that handles the math validation securely on the server and routes the lead.

TRUST BRICKS PROPERTIES LTD — SYSTEM CONTEXT & BLUEPRINT

Version: 1.3 | Status: Phase 4 (Frontend Hookups & Sanity CMS)
Slogan: "Teamwork Makes The Dream Work"
Core Job: Convert Nigerian professionals into PenCom mortgage leads.

1. TECH STACK & ENV

Frontend: Next.js (App Router), React, Tailwind CSS, Framer Motion

Backend: PostgreSQL (Docker/Coolify), Prisma ORM, Next.js Server Actions

CMS: Sanity.io (For Blogs, FAQs, Testimonials)

Deployment: Vercel (Frontend/API) + Coolify (PostgreSQL)

2. DESIGN TOKENS (Strictly Enforced)

Primary Color: Deep Sapphire Navy (#0D1F3C -> hover #162E57)

Action Color: Burnt Conversion Orange (#E8600A -> hover #D4530A)

Typography: Plus Jakarta Sans (Display/Headings), Inter (Body)

Motion Physics: Spring (stiffness: 180-280, damping: 20-28)

3. PFA ROUTING LOGIC (Server-Side Enforced)

Stanbic IBTC: ₦5,000,000 min

GT Pension: ₦1,000,000 min

Citizens Pensions: Tier 1 (₦500k) / Tier 2 (₦200k)

All Others: ₦500,000 min
(Logic securely enforced via Prisma Lead creation in processMortgageLead Server Action)

4. CURRENT PROGRESS STATUS

[x] UI Components: Navbar, Hero, Funnel Modal, Trust Marquee, How It Works, Mortgage Calculator, Footer.

[x] Motion UI: Framer Motion parallax, staggered reveals, and magnetic hovers implemented.

[x] Database Setup: PostgreSQL Dockerized, Prisma Schema created.

[x] Routing Engine: Server Action (processMortgageLead) and seeding script written.

[ ] Frontend Hookup: Connect Eligibility Funnel to Server Action.

[ ] CMS Setup: Sanity schema for SEO Blogs and FAQs.

5. NEXT OBJECTIVE: "HOOKUPS & CMS"

Refactor the EligibilityFunnel.tsx client component to use the processMortgageLead Server Action.

Implement loading states (pending) and success/error toasts.

Create Sanity.io schemas (post, author, faq) to power the SEO marketing engine.
TRUST BRICKS PROPERTIES LTD — SYSTEM CONTEXT & BLUEPRINT

Version: 1.4 | Status: Phase 5 (Production Optimization, Security & Coolify Deploy)
Slogan: "Teamwork Makes The Dream Work"
Core Job: Convert Nigerian professionals into PenCom mortgage leads.

1. TECH STACK & ENV

Frontend: Next.js (App Router), React, Tailwind CSS, Framer Motion

Backend: PostgreSQL, Prisma ORM, Next.js Server Actions

CMS: Sanity.io (For Blogs, FAQs, Testimonials)

Deployment: Vercel (Frontend/API) + Coolify (PostgreSQL) -> Transitioning to full Docker/Coolify

2. DESIGN TOKENS (Strictly Enforced)

Primary Color: Deep Sapphire Navy (#0D1F3C -> hover #162E57)

Action Color: Burnt Conversion Orange (#E8600A -> hover #D4530A)

Typography: Plus Jakarta Sans (Display/Headings), Inter (Body)

Motion Physics: Spring (stiffness: 180-280, damping: 20-28)

3. PFA ROUTING LOGIC (Server-Side Enforced)

Stanbic IBTC: ₦5,000,000 min

GT Pension: ₦1,000,000 min

Citizens Pensions: Tier 1 (₦500k) / Tier 2 (₦200k)

All Others: ₦500,000 min

4. CURRENT PROGRESS STATUS

[x] UI Components: Navbar, Hero, Funnel Modal, Trust Marquee, How It Works, Mortgage Calculator, Footer.

[x] Motion UI: Framer Motion parallax, staggered reveals, and magnetic hovers implemented.

[x] Database Setup: PostgreSQL Dockerized, Prisma Schema created & seeded.

[x] Routing Engine: Server Action (processMortgageLead) securely processes logic.

[x] Frontend Hookup: useTransition implemented in EligibilityFunnel.tsx.

[x] CMS Setup: Sanity.io schemas (post, author, faq) created with SEO fieldsets.

5. FINAL OBJECTIVE: "PHASE 5 - LAUNCH PREP"

Security: Implement Rate Limiting to prevent lead-form spam and add strict Security Headers in next.config.ts.

SEO & Meta: Generate dynamic sitemap.ts, robots.txt, and configure global layout metadata (OpenGraph).

Coolify Dockerization: Create a multi-stage, optimized Dockerfile for a standalone Next.js production build to be hosted on the VPS.