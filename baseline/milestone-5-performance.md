# Milestone 5 — Performance comparison

Baseline (Milestone 0) was measured against the **live production site**
(https://www.aldabouqi.com). This pass was measured against the **new
Next.js app running locally** (`next build && next start` on
localhost:3000) — there's no deployed preview yet (Postgres/Vercel account
linking is still pending per the user). Localhost has no CDN, no edge
caching, and Lighthouse's mobile-throttling simulation penalizes it more
than a real edge-hosted deployment would be. Treat these numbers as proof
the *code-level* work paid off, not as the final pre-launch numbers —
Milestone 8 re-runs this against the real preview URL.

## Scores

| Page | Metric | Before (live) | After (local build) |
|---|---|---|---|
| Home | Perf mobile / desktop | 56 / 92 | **69 / 98** |
| Home | LCP mobile / desktop | 14.9s / 1.0s | **5.3s / 1.1s** |
| About | Perf mobile / desktop | 56 / 90 | **77 / 99** |
| About | LCP mobile / desktop | 13.3s / 1.3s | **4.9s / 1.0s** |
| Location (abdali) | Perf mobile / desktop | 56 / 83 | **64 / 99** |
| Location (abdali) | LCP mobile / desktop | 13.1s / 2.8s | **8.5s / 1.0s** |
| Contact | Perf mobile / desktop | 58 / 83 | **77 / 99** |
| Contact | LCP mobile / desktop | 9.0s / 2.5s | **4.9s / 1.0s** |
| All pages | Accessibility | 87–92 | **89–100** |
| All pages | Best Practices | 96–100 | **96–100** |

Desktop performance is now essentially maxed out (98–99) on every page.
Mobile LCP dropped by more than half everywhere, and by 60%+ on three of
the four pages — driven by dropping ~6.7MB of confirmed-dead assets
(three.js/GSAP stack, the 4.9MB broken Font Awesome Pro kit) and the
Bootstrap+jQuery+plugin stack (~1.1MB) that the old site loaded on every
page, none of which exist in the new codebase at all.

## Why "delete dead assets" wasn't a separate step here

The Milestone 0 audit found three.js, hover-img-effect.js, ordain-it.js,
and the Font Awesome Pro kit were dead weight on the *old* static site.
Since the new app was built from scratch in `web/` rather than edited
in place, none of that ever got ported — there was nothing to delete.
The old root-level static files stay untouched in the repo (they're still
what's live in production until the Milestone 8 cutover); deleting them
now would have zero effect on the new app's performance and would only
matter for repo housekeeping, so it's left for the cutover itself, when
the whole root static site gets retired at once anyway.

## next/image and next/font — already done in Milestones 2–3

- Zero raw `<img>` tags anywhere in `web/src` — every image already goes
  through `next/image` (logo, hero photo).
- Fonts are self-hosted via `next/font/google` (`display: "swap"`) since
  Milestone 2, matching the current site's font stack exactly.
- `public/img` is 168KB total (3 logo files + 1 hero photo) vs the old
  site's 12MB `assets/img` — the redesign doesn't carry forward decorative
  imagery that got dropped (team photos, blog thumbnails, shape/webgl
  assets, etc.), which the new component library doesn't use.

## SEO score dip (85 vs 100 baseline) — both explained, not real issues

Lighthouse's SEO category flagged two things, both artifacts of testing a
pre-launch app on localhost rather than a real bug:

1. **robots.txt "not valid"** — there's no `robots.ts` yet; that's
   Milestone 7 (`app/robots.ts` ports the current robots.txt verbatim).
2. **Canonical URL "points to another hreflang location"** — the
   canonical/hreflang tags correctly point at `https://www.aldabouqi.com`
   (the real production domain, per `lib/constants.ts`), which Lighthouse
   flags as a mismatch against `http://localhost:3000`. This is expected
   and correct — the tags should already point at the eventual production
   URL, not the current test URL.

Both resolve on their own once Milestone 7 (SEO/redirect parity pass)
ships robots.ts/sitemap.ts and the app is reachable at a real URL.

Full reports: `baseline/lighthouse-milestone5/*.report.{html,json}`.
