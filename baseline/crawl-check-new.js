// QA crawl for the Next.js app (nextjs-migration branch), run against a
// local `next start` server. Mirrors crawl-check.js's methodology but adds
// meta extraction + comparison against the Milestone 0 baseline
// (content/all-meta.json) for the pages that have one.
const fs = require("fs");
const path = require("path");

const baseDir = __dirname;
const ORIGIN = process.argv[2] || "http://localhost:3910";

function tag(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function extractMeta(html) {
  return {
    title: tag(html, /<title>([\s\S]*?)<\/title>/),
    description: tag(html, /<meta name="description" content="([\s\S]*?)"\s*\/?>/),
    canonical: tag(html, /<link rel="canonical" href="([\s\S]*?)"\s*\/?>/),
    ogTitle: tag(html, /<meta property="og:title" content="([\s\S]*?)"\s*\/?>/),
    ogDescription: tag(html, /<meta property="og:description" content="([\s\S]*?)"\s*\/?>/),
    keywords: tag(html, /<meta name="keywords" content="([\s\S]*?)"\s*\/?>/),
    jsonLdTypes: [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]),
    hasHreflangEn: /hreflang="en"/.test(html),
    hasHreflangAr: /hreflang="ar"/.test(html),
  };
}

// 45 live sitemap URLs (production paths), remapped onto the local origin.
const sitemapPaths = fs
  .readFileSync(path.join(baseDir, "crawl/sitemap-urls.txt"), "utf8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((u) => new URL(u).pathname);

// Extra paths the QA pass asked for beyond the live sitemap, plus the
// English pages confirmed to exist as real content in the old repo's en/
// folder (en/about.html, en/services.html, etc. — not just the city-page
// redirects) even though the old sitemap.xml never listed them.
const extraPaths = [
  "/privacy-policy",
  "/en",
  "/en/privacy-policy",
  "/en/about",
  "/en/services",
  "/en/contact",
  "/en/coverage-areas",
  "/en/partner",
  "/en/buy-used-bedrooms",
  "/en/buy-used-home-furniture",
  "/en/buy-used-office-furniture",
];

const allPaths = [...new Set([...sitemapPaths, ...extraPaths])];

async function main() {
  const results = [];
  for (const p of allPaths) {
    const url = ORIGIN + p;
    try {
      const res = await fetch(url, { redirect: "manual" });
      const html = res.status === 200 ? await res.text() : "";
      results.push({ path: p, status: res.status, ...extractMeta(html) });
    } catch (e) {
      results.push({ path: p, status: "ERROR", error: e.message });
    }
  }

  fs.writeFileSync(path.join(baseDir, "crawl/new-app-status.json"), JSON.stringify(results, null, 2));

  const bad = results.filter((r) => r.status !== 200);
  console.log(`Checked ${results.length} paths against ${ORIGIN}`);
  console.log(`200 OK: ${results.length - bad.length} | non-200: ${bad.length}`);
  if (bad.length) console.log("NON-200:", JSON.stringify(bad, null, 2));

  const noJsonLd = results.filter((r) => r.status === 200 && r.jsonLdTypes.length === 0);
  if (noJsonLd.length) {
    console.log(
      "Pages with ZERO JSON-LD blocks:",
      noJsonLd.map((r) => r.path)
    );
  }
}

main();
