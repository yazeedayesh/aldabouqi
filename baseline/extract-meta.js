const fs = require('fs');
function tag(html, re) { const m = html.match(re); return m ? m[1].trim() : null; }
function extract(file) {
  const html = fs.readFileSync(file, 'utf8');
  return {
    title: tag(html, /<title>([\s\S]*?)<\/title>/),
    description: tag(html, /<meta name="description" content="([\s\S]*?)"\s*\/?>/),
    canonical: tag(html, /<link rel="canonical" href="([\s\S]*?)"\s*\/?>/),
    ogTitle: tag(html, /<meta property="og:title" content="([\s\S]*?)"\s*\/?>/),
    ogDescription: tag(html, /<meta property="og:description" content="([\s\S]*?)"\s*\/?>/),
    ogImage: tag(html, /<meta property="og:image" content="([\s\S]*?)"\s*\/?>/),
    keywords: tag(html, /<meta name="keywords" content="([\s\S]*?)"\s*\/?>/),
  };
}
const pages = ['about','services','contact','coverage-areas','partner','privacy-policy','buy-used-home-furniture','buy-used-office-furniture','buy-used-bedrooms','index'];
const result = {};
for (const p of pages) {
  result[p] = { ar: extract(`${p}.html`), en: extract(`en/${p}.html`) };
}
fs.writeFileSync('baseline/content/all-meta.json', JSON.stringify(result, null, 2));
console.log('done');
