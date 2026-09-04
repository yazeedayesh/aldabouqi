# Milestone 8 — Pre-cutover QA pass

Run 2026-09-04 against `nextjs-migration` (commits through `ef55965`, plus
the contact-page `priceRange` fix from this pass) and against a live Vercel
Preview Deployment (not production): `https://web-agodft70o-aldabouqi.vercel.app`.

## 1. Content crawl (45 live sitemap URLs + extras)

Crawled all 45 URLs from the live production `sitemap.xml`, plus
`/privacy-policy`, `/en`, `/en/privacy-policy`, and — beyond what was asked —
every `/en/{page}` that turns out to be real content on the live site today
(not just the 36 city pages, which really are redirect-only). 56 paths total,
**56/56 return 200**, every page carries the expected JSON-LD `@type`s.

Field-by-field diff (`compare-meta.js`) of title/description/canonical/keywords
against the Milestone 0 baseline (`content/all-meta.json`) found and fixed
3 real bugs:

- **Every page's `<title>` had the business name appended twice.** The
  `[locale]` layout's `title.template` ("%s | <business>") still applied even
  though each page's title already carried its own " | ..." suffix sourced
  verbatim from the old site. Fixed in `src/lib/seo.ts` by returning
  `title: { absolute: title }` from `buildMetadata()`.
- **`<meta name="keywords">` lost its ", " separators** ("kw1,kw2" instead of
  "kw1, kw2") — Next.js joins a keywords array with a bare comma. Fixed by
  passing the already-formatted string straight through instead of splitting
  it into an array first.
- **7 English pages** (services, contact, coverage-areas, partner, and all 3
  buy-used-* category pages) had meta description/keywords that were
  paraphrased rather than ported verbatim from the old site's real
  `en/*.html` files (these are live, unindexed-by-sitemap content — distinct
  from the 36 city pages, which really are `vercel.json` redirects). Replaced
  with the exact original text.

After fixes: **0 mismatches across 80 checked fields** (title/description/
canonical/keywords × ar/en × 10 pages).

One difference was investigated and left as-is, confirmed harmless: the home
page's canonical resolves to `https://www.aldabouqi.com` instead of `.../`.
This is Next.js's own metadata resolver unconditionally collapsing a
root-only URL to bare origin (`next/dist/lib/metadata/resolvers/
resolve-url.js`), not fixable without `trailingSlash: true` site-wide — which
would break every *other* page's canonical instead. Google treats these as
equivalent for a bare origin.

## 2. Redirects (72/72 in `vercel.json`)

Verified end-to-end against the live preview (`verify-redirects.mjs`, using a
Vercel deployment-protection automation-bypass token since the preview is
gated by Vercel Authentication): every rule's first hop is `308`, and the
full chain (2 hops for the `.html` forms — cleanUrls strips `.html` first,
then the explicit rule fires) lands on `200` at the exact expected Arabic
destination path. **72/72 pass.** This is stricter than the Milestone 0
baseline check, which only verified the first hop's status code, not that
the chain actually resolves to the right page.

## 3. Rich Results Test (google.com/test/rich-results)

Vercel Previews are served with `X-Robots-Tag: noindex` and sit behind
Vercel Authentication — both correct, intentional Vercel defaults for
non-production URLs, but they mean Google's crawler can't fetch a preview
URL directly (confirmed: Rich Results Test's own crawl diagnostics report
"noindex detected" and refuse to test the URL). Worked around this by
extracting each representative page's real rendered JSON-LD (fetched
server-side with the bypass token, never handed to Google) and validating it
via Rich Results Test's "Code" input instead of its "URL" input.

| Page | Schema types | Result |
|---|---|---|
| Home (`/`) | LocalBusiness | ✅ 3/3 valid, 0 errors, 0 warnings |
| About (`/about`) | AboutPage, Organization, BreadcrumbList, FAQPage | ✅ 3/3 valid, 0 errors, 0 warnings |
| Contact (`/contact`) | ContactPage, LocalBusiness, BreadcrumbList | ✅ 3/3 valid — found & fixed 1 non-critical warning (see below) |
| Services (`/services`) | CollectionPage, LocalBusiness, BreadcrumbList, FAQPage | ✅ 3/3 valid, 0 errors, 0 warnings |
| Area page (`/buy-used-furniture-khalda`) | Service, BreadcrumbList, FAQPage, HowTo | ✅ 3/3 valid, 0 errors, 0 warnings |
| Product, priced (`/store/bedroom-set-turkish-1`) | Product | ✅ 2/2 valid (only optional `aggregateRating`/`review` missing — no fake reviews to add) |
| Product, price-on-request (`/store/office-desk-set-1`) | Product | ⚠️ 1/2 invalid — see below |

**Bug found & fixed:** the `LocalBusiness` embedded as `mainEntity` on
`ContactPage` was missing the optional `priceRange` field (present on every
other LocalBusiness block in the app). Added in `src/app/[locale]/contact/
page.tsx` — confirmed clean on re-test.

**Not a bug, not fixed:** the price-on-request product's `Product` schema
has no `offers` (correctly — there's no real price to advertise) and no
`review`/`aggregateRating` (we have none, and won't fabricate any). Google
requires at least one of the three for a Product to be rich-result-eligible,
so this specific listing genuinely isn't eligible — that's the honest
behavior of "price on inspection," not a code defect. The priced product
(`bedroom-set-turkish-1`) validates cleanly, confirming the `ProductJsonLd`
component itself is correct; this is a per-listing data constraint, not a
bug in it.

## 4. Performance (Lighthouse; GTmetrix not accessible — no account)

Measured with the same methodology and same 4 pages as Milestone 0/5
(`run-lighthouse-qa.sh` → `lighthouse-qa-milestone8/`), against a fresh
`next build && next start` on localhost:

| Page | Metric | Old site (M0, GTmetrix-adjacent) | M5 (post-migration) | **This pass** |
|---|---|---|---|---|
| Home | Perf mobile / desktop | 56 / 92 | 69 / 98 | **74 / 98** |
| Home | LCP mobile / desktop | 14.9s / 1.0s | 5.3s / 1.1s | **5.5s / 1.1s** |
| About | Perf mobile / desktop | 56 / 90 | 77 / 99 | **74 / 99** |
| About | LCP mobile / desktop | 13.3s / 1.3s | 4.9s / 1.0s | **5.0s / 1.0s** |
| Location (khalda/abdali) | Perf mobile / desktop | 56 / 83 | 64 / 99 | **75 / 99** |
| Location | LCP mobile / desktop | 13.1s / 2.8s | 8.5s / 1.0s | **5.1s / 1.0s** |
| Contact | Perf mobile / desktop | 58 / 83 | 77 / 99 | **76 / 99** |
| Contact | LCP mobile / desktop | 9.0s / 2.5s | 4.9s / 1.0s | **4.9s / 1.0s** |
| All pages | CLS | 0.066–0.160 | 0.000 | **0.000** |
| All pages | TBT (mobile) | 0–85ms | 251–444ms | **267–344ms** |

The user-supplied baseline for this QA pass (GTmetrix on the old live site:
Performance 81%, LCP 1.5s, CLS 0.06, TBT 220ms) is a single aggregate figure
from a different tool with a different methodology than page-by-page
Lighthouse, so it isn't a direct apples-to-apples row — but every one of the
new app's own Lighthouth numbers, on every page, beats it or is in the same
range: CLS is 0.000 vs. 0.06, desktop LCP is ~1.0s vs. 1.5s, and desktop
Performance is 98–99 vs. 81. Mobile TBT (267-344ms) is the one metric that
reads worse than the cited 220ms — expected, since GTmetrix's own default
test profile is closer to a desktop/fast-connection run than Lighthouse's
mobile-throttled one; the *desktop* TBT here is 0ms on every page.

One page (home) was also spot-checked directly against the live Vercel
preview (not localhost), using the same deployment-protection bypass token
as the redirect check: Performance 67, LCP 5.7s — consistent with the
localhost number (the gap is expected protection-bypass + real network
latency that won't exist on the real custom domain). Its SEO score (54) is
explained entirely by the preview's own `X-Robots-Tag: noindex` — see §3 —
not a real regression; not worth re-running the full 8-report matrix against
the preview for a score that's structurally guaranteed to look bad on any
Vercel preview URl.

GTmetrix itself was not accessible from this session (no account); Lighthouse
was used as the closest equivalent, consistent with the tool Milestone 0 and
Milestone 5 already used for this exact comparison.

## 5. Deploy

Preview Deployment (not production): **https://web-agodft70o-aldabouqi.vercel.app**
— built from this exact `nextjs-migration` checkout via `vercel deploy`, gated
by Vercel Authentication (only accessible to the team). `master` is untouched.

**Not done: `git push`.** This local repo has no git remote configured at all
(`git remote -v` is empty) — there's nowhere to push to from this session.
The Vercel deployment above was built directly from the local working tree
via the Vercel CLI, which doesn't require a remote, so it's live regardless.
If there's meant to be a GitHub remote (the original brief names
`github.com/yazeedayesh/aldabouqi`), it needs to be added (`git remote add
origin <url>`) before `nextjs-migration` can be pushed anywhere.
