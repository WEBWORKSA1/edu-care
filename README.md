# Edu.Care

**Care for every learner.** Edu.Care is a free education-support hub for students and families: practical guides, free study and money tools, a scholarship finder, auto-updated education news and videos, plus a free personalized learning-plan service.

Static site — pure HTML/CSS/JS, no build step. Runs on the free GitHub Pages plan from the `main` branch.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Home |
| `guides.html`, `guides/` | Evergreen guides (AdSense-friendly original content) |
| `tools.html`, `tools/` | GPA, final grade, student loan, college savings calculators; focus timer |
| `scholarships.html` | Filterable scholarship finder (`data/scholarships.json`) |
| `videos.html`, `news.html` | Auto-updated from `data/videos.json`, `data/news.json` |
| `get-help.html` | Lead generation: multi-step free learning-plan request |
| `support.html` | Donations, pledges and sponsorships |
| `contests.html` | Monthly contest with official rules |
| `careers.html` | Hiring talent |
| `partner.html` | Advertising, sponsorship, partnerships, lead partners |
| legal pages | privacy, terms, cookies, disclaimer, trademark & copyright, editorial policy |
| `assets/js/layout.js` | Shared header + footer for every page |
| `assets/js/app.js` | Theme, forms, search, feeds, video embeds |
| `assets/js/tools.js` | Calculator and timer logic |
| `scripts/update_feeds.py` + `.github/workflows/update-content.yml` | Self-updating content every 6 hours |

## Self-updating content
The `Auto-update content` workflow runs every 6 hours (and on demand from the Actions tab). It pulls education news RSS feeds and the latest uploads from education YouTube channels, then commits fresh JSON. Pages read the JSON at runtime.

## Forms
All forms post through FormSubmit. The destination inbox is assembled at runtime and never printed in the page. **First submission:** FormSubmit sends a one-time activation email to the inbox — click it once and every form starts delivering.

## Monetization
- Google AdSense Auto ads (`ca-pub-6620975821265271`) on every page, plus `ads.txt`.
- Lead generation (`get-help.html`) with explicit consent to share with vetted partners.
- Donations, sponsorship packages, advertising and partnership inquiries.

## Custom domain
To serve on `edu.care`: add a `CNAME` file containing `edu.care`, then point DNS at GitHub Pages (A records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 and a `www` CNAME to `webworksa1.github.io`). Enable "Enforce HTTPS" in Settings → Pages.

See `PROMPT.md` for the phase-wise build prompt and `RESEARCH.md` for the competitive feature research.

© Edu.Care. All rights reserved. See `trademark.html`.
