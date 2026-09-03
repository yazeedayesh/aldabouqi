# Milestone 0 — Pre-migration baseline

Captured 2026-09-03 against the live production site (https://www.aldabouqi.com),
before any change reaches production. Kept here for comparison against the
Vercel preview (pre-cutover) and against production again after cutover.

## Lighthouse (mobile + desktop)

Chrome-based Lighthouse 12.8.2, default throttling presets (mobile: simulated
slow 4G/mid-tier device; desktop: `--preset=desktop`). Raw JSON+HTML reports
are in `lighthouse/`.

| Page | Perf (mobile) | Perf (desktop) | A11y | Best Practices | SEO | LCP (mobile) | LCP (desktop) |
|---|---|---|---|---|---|---|---|
| Home (`/`) | 56 | 92 | 87 | 100 | 100 | 14.9 s | 1.0 s |
| About | 56 | 90 | 91 | 96 (mobile) / 100 | 100 | 13.3 s | 1.3 s |
| Location page (`buy-used-furniture-abdali`) | 56 | 83 | 87 | 100 | 100 | 13.1 s | 2.8 s |
| Contact | 58 | 83 | 92 | 100 | 100 | 9.0 s | 2.5 s |

Takeaway: mobile performance is the real liability (LCP 9-15s), consistent
with the audit findings (three.js/GSAP dead code, 4.9MB broken Font Awesome
Pro kit, unoptimized images, Bootstrap+jQuery stack). Desktop is already
decent. SEO score is 100 everywhere today — the migration must not regress
this. This table is the reference point for Milestone 5 (performance pass)
and the final pre-cutover Lighthouse re-run in Milestone 8.

## Sitemap crawl (`crawl/sitemap-status.json`)

All 45 URLs in the live `sitemap.xml` checked with `GET`, `redirect: manual`.
Result: **45/45 return 200.** No broken URLs in the current sitemap.

## Redirect crawl (`crawl/redirects-status.json`)

All 72 redirect rules in the live `vercel.json` tested against production
(`https://www.aldabouqi.com<source>`). Result: **72/72 resolve as configured**
(the 36 area slugs × 2 forms — `.html` and extensionless — each redirecting
to their consolidated Arabic target). This is the exact behavior that must
still hold, unchanged, on the Vercel preview and after cutover.

## Ground-truth file copies

`robots.txt`, `sitemap.xml`, `vercel.json` copied here verbatim from the
repo root (confirmed identical to what's live in production via direct
fetch — see `crawl/live-sitemap.xml` / `crawl/live-robots.txt`). These are
also preserved in git history at the `a694958` baseline commit; the copies
here are for quick side-by-side diffing later without checking out an old
commit.

## How to re-run

```
bash baseline/run-lighthouse.sh   # regenerate lighthouse/*.report.{json,html}
node baseline/crawl-check.js       # regenerate crawl/*-status.json
```
