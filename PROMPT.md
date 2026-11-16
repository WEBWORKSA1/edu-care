# Edu.Care — Phase-wise Build Prompt

A reusable, phase-by-phase prompt for building (or rebuilding) Edu.Care. Paste each phase into your AI builder in order. Each phase ends with acceptance checks.

---

## The winning idea

**Edu.Care = "Care for every learner"** — a free education-support hub for students and families that monetizes through three stacked engines:

1. **AdSense on high-intent, high-CPC education traffic.** Education, student loans, online degrees, test prep and tutoring are among the most valuable ad verticals. Calculators (GPA, final grade, student loan) pull evergreen search volume every semester.
2. **Lead generation.** A multi-step "Free Learning Plan" captures opt-in requests (tutoring, test prep, admissions, study abroad, online degrees, learning support, early years). Opt-in leads can be sold to or shared with vetted tutoring companies, counselors, study-abroad agencies and online programs on a per-lead or subscription basis. This is the highest-value engine.
3. **Community and sponsorship.** Donations, tool/guide/contest sponsorships, careers (talent pipeline) and monthly contests that drive repeat visits, backlinks and email signups.

Why this beats alternatives (pure news blog, course marketplace, childcare directory): low build cost on free hosting, evergreen search demand, multiple monetization layers, and the brandable two-word name "Edu.Care" reads as trustworthy and family-friendly.

---

## Phase 0 — Brief
```
Build "Edu.Care" (domain edu.care), a free education-support website for students and families.
Stack: static HTML/CSS/vanilla JS only, no build step, hosted on GitHub Pages (free plan, main branch, repo WEBWORKSA1/edu-care).
All internal links relative so the site works at both webworksa1.github.io/edu-care/ and edu.care.
Design: modern, warm, trustworthy. Navy ink + coral + mint + sunflower accents; Fraunces display + Inter body; rounded cards; light/dark mode; mobile-first; WCAG AA.
Every page: AdSense script in <head> (ca-pub-6620975821265271) + google-adsense-account meta; a top bar reading
"Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linked to https://web.works/contact.
Never print the owner's email anywhere. All forms deliver to the owner's inbox via FormSubmit, with the address assembled at runtime from an obfuscated string.
Avoid any trademark confusion with organizations named "Educare"; include a trademark & copyright disclosure page.
```
Acceptance: brief saved; repo initialized on main.

## Phase 1 — Foundation
```
Create assets/css/style.css (design tokens, components: topbar, sticky header, hero, cards, grids, forms, steps, tables, details/FAQ, footer, cookie banner, back-to-top, reading progress, dark mode, reduced-motion).
Create assets/js/layout.js that injects the shared header (nav: Guides, Tools, Scholarships, Videos, News, Contests, Careers, Support; search; theme toggle; "Free Learning Plan" CTA) and footer (newsletter, 4 link columns, legal + independence notice, cookie banner) on every page, using data-root for relative paths.
Create assets/js/app.js: theme, mobile menu, cookie consent (essential = non-personalized ads), reveal-on-scroll, TOC builder, share buttons, lite YouTube embeds, JSON-driven news/videos/tips, client-side search, month-end countdown, donation amount picker, FormSubmit AJAX forms with honeypot, multi-step forms, ?need= prefill.
```
Acceptance: header/footer render on all pages; dark mode persists; no console errors.

## Phase 2 — Content for AdSense approval
```
Write 12+ original, people-first guides (600–1,000 words each) with H2 structure, tables, callouts, internal links to tools and the lead form, Article schema, reviewed date:
GPA calculation; study schedule; choosing a tutor; scholarship playbook; paying for college; learning differences; screen time; study abroad timeline; online degrees & accreditation; exam stress; choosing preschool/childcare; college application essay.
Add hubs: guides.html (filterable), plus About, Editorial Policy, Contact.
```
Acceptance: no thin pages; every guide links to 2+ internal pages; no copied text.

## Phase 3 — Interactive tools (traffic magnets)
```
Build tools/ pages with explanatory content + FAQ: GPA calculator (weighted/unweighted, honors/AP, prior GPA), final grade calculator, student loan calculator (amortization + extra payments), college savings calculator, Pomodoro focus timer; scholarship finder (filter by keyword/level/country from data/scholarships.json, official links only).
```
Acceptance: math verified against hand calculations; tools work offline after load.

## Phase 4 — Lead generation engine
```
get-help.html: 3-step form (need → learner details → contact) with progress bar, required consent, and a separate optional consent to share with up to 3 vetted partners. Prefill need from ?need=. Trust blocks + FAQ.
Add lead CTAs: hero quick form on home, sidebar CTA on every guide/tool with a matching ?need= value, lead band on home and guides.
```
Acceptance: each submission arrives with all fields + page URL; partner consent clearly optional.

## Phase 5 — Monetization layers
```
AdSense Auto ads on every page + ads.txt (google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0).
support.html: donation tiers → pledge form (amount, frequency, designation: operations, promotion/marketing, hiring talent, contests/prizes), sponsorship packages.
partner.html: lead partnerships, sponsorships, direct ads, school listings, content collabs, licensing; partner standards; inquiry form; business contact link.
```

## Phase 6 — Community
```
contests.html: monthly "Study Hack Challenge" with countdown, prizes, entry form, judging criteria and official rules (no purchase necessary, 13+, minors need guardian consent, void where prohibited).
careers.html: writer, video creator, tutor partner, social/community, campus ambassador, expert reviewer; application form (links, no uploads).
```

## Phase 7 — Self-updating automation
```
scripts/update_feeds.py (stdlib only): pull education news RSS (Google News queries, Hechinger, The Conversation, EdSurge) and latest videos from education YouTube channels (Khan Academy, TED-Ed, CrashCourse, Kurzgesagt, SciShow, MinutePhysics, study-skills channels); write data/news.json + data/videos.json; never overwrite with empty results; refresh sitemap lastmod.
.github/workflows/update-content.yml: every 6 hours + manual run; commit changes.
Pages show static fallback content until data arrives. Daily rotating tip from data/tips.json.
```

## Phase 8 — Compliance & legal
```
privacy.html (AdSense/third-party vendor cookie language, opt-out links, FormSubmit, YouTube, children under 13, rights under GDPR/CCPA/PIPEDA/DPDP), terms.html, cookies.html, disclaimer.html, trademark.html (non-affiliation with any "Educare" organization, third-party marks, copyright, complaint process), editorial-policy.html.
Cookie banner on all pages. Enable Google's certified CMP in AdSense (Privacy & messaging) for EEA/UK.
```

## Phase 9 — SEO & performance
```
Unique titles/descriptions, canonical URLs on edu.care, Open Graph, JSON-LD (Organization, WebSite+SearchAction, Article, WebApplication), sitemap.xml, robots.txt (allow Mediapartners-Google), 404.html, search index data/search.json. Lazy-load video thumbnails; no heavy libraries.
```

## Phase 10 — Deploy & QA
```
Push to main of WEBWORKSA1/edu-care. Settings → Pages → Deploy from branch: main / (root).
Add CNAME "edu.care" and DNS (A: 185.199.108-111.153; www CNAME webworksa1.github.io) when ready; Enforce HTTPS.
QA: every link, every form (first submission triggers FormSubmit activation), mobile layout, dark mode, Lighthouse ≥ 90.
Submit sitemap in Google Search Console; apply for AdSense once indexed.
```

## Phase 11 — Growth roadmap
- Add 4–8 guides per month targeting long-tail questions (country-specific aid, exam guides, subject study guides).
- Programmatic pages: "GPA calculator for [country/scale]", "scholarships for [major]".
- Email newsletter digest from news.json; lead-partner portal; sponsor-funded tools.
