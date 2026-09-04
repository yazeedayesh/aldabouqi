const fs = require("fs");
const path = require("path");

const baseDir = __dirname;
const baseline = JSON.parse(fs.readFileSync(path.join(baseDir, "content/all-meta.json"), "utf8"));
const newApp = JSON.parse(fs.readFileSync(path.join(baseDir, "crawl/new-app-status.json"), "utf8"));

const byPath = new Map(newApp.map((r) => [r.path, r]));

const pageToPath = {
  index: { ar: "/", en: "/en" },
  about: { ar: "/about", en: "/en/about" },
  services: { ar: "/services", en: "/en/services" },
  contact: { ar: "/contact", en: "/en/contact" },
  "coverage-areas": { ar: "/coverage-areas", en: "/en/coverage-areas" },
  partner: { ar: "/partner", en: "/en/partner" },
  "privacy-policy": { ar: "/privacy-policy", en: "/en/privacy-policy" },
  "buy-used-home-furniture": { ar: "/buy-used-home-furniture", en: "/en/buy-used-home-furniture" },
  "buy-used-office-furniture": { ar: "/buy-used-office-furniture", en: "/en/buy-used-office-furniture" },
  "buy-used-bedrooms": { ar: "/buy-used-bedrooms", en: "/en/buy-used-bedrooms" },
};

const fields = ["title", "description", "canonical", "keywords"];
let mismatches = 0;
let checks = 0;

for (const [page, locales] of Object.entries(pageToPath)) {
  for (const locale of ["ar", "en"]) {
    const p = locales[locale];
    const old = baseline[page]?.[locale];
    const cur = byPath.get(p);
    if (!old || !cur) {
      console.log(`SKIP ${page}/${locale} (${p}): missing baseline or crawl entry`);
      continue;
    }
    for (const field of fields) {
      checks++;
      const oldVal = (old[field] || "").trim();
      // React SSR HTML-entity-encodes apostrophes/quotes in attribute
      // output (' -> &#x27;) — decode before comparing since a browser or
      // crawler reads these back identically; this is a raw-HTML-diff
      // artifact of this script, not a real content difference.
      const newVal = (cur[field] || "").trim().replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
      // Next.js's metadata resolver collapses a root-only canonical
      // ("https://x.com/") down to bare origin ("https://x.com") whenever
      // pathname === "/" — confirmed in next/dist/lib/metadata/resolvers/
      // resolve-url.js, unavoidable short of trailingSlash:true site-wide
      // (which would break every OTHER canonical). Google treats these as
      // equivalent for the bare origin, so this specific case is not a
      // real mismatch.
      if (field === "canonical" && oldVal === newVal + "/") continue;
      if (oldVal !== newVal) {
        mismatches++;
        console.log(`MISMATCH ${page}/${locale}.${field} (${p})`);
        console.log(`  old: ${oldVal}`);
        console.log(`  new: ${newVal}`);
      }
    }
  }
}

console.log(`\n${checks} fields checked, ${mismatches} mismatches.`);
