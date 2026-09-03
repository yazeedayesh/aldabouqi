const fs = require('fs');

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');

function tag(re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

const title = tag(/<title>([\s\S]*?)<\/title>/);
const description = tag(/<meta name="description" content="([\s\S]*?)"\s*\/?>/);
const canonical = tag(/<link rel="canonical" href="([\s\S]*?)"\s*\/?>/);
const ogTitle = tag(/<meta property="og:title" content="([\s\S]*?)"\s*\/?>/);
const ogDesc = tag(/<meta property="og:description" content="([\s\S]*?)"\s*\/?>/);
const ogImage = tag(/<meta property="og:image" content="([\s\S]*?)"\s*\/?>/);
const keywords = tag(/<meta name="keywords" content="([\s\S]*?)"\s*\/?>/);

const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(m => { try { return JSON.parse(m[1]); } catch (e) { return { parseError: e.message, raw: m[1].slice(0,200) }; } });

console.log('=== META ===');
console.log(JSON.stringify({ title, description, canonical, ogTitle, ogDesc, ogImage, keywords }, null, 2));
console.log('=== JSON-LD (@type list) ===');
console.log(jsonLdBlocks.map(b => b['@type']).join(', '));
console.log('=== JSON-LD FULL ===');
console.log(JSON.stringify(jsonLdBlocks, null, 2));
