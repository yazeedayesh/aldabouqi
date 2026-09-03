const fs = require('fs');

const file = process.argv[2];
let html = fs.readFileSync(file, 'utf8');

// Drop everything before the first <main or content-ish marker isn't reliable across
// this theme, so instead: strip header/nav/footer by known class markers, scripts, styles.
html = html.replace(/<script[\s\S]*?<\/script>/g, '');
html = html.replace(/<style[\s\S]*?<\/style>/g, '');
html = html.replace(/<!--[\s\S]*?-->/g, '');

// Remove the header/footer sections (this theme wraps them in header.it-header and footer.it-footer-wrapper)
html = html.replace(/<header[\s\S]*?<\/header>/, '');
html = html.replace(/<footer[\s\S]*?<\/footer>/, '');

// Convert block-level tags to newlines, headings get a marker prefix
html = html.replace(/<h([1-6])[^>]*>/g, (_, n) => `\n${'#'.repeat(Number(n))} `);
html = html.replace(/<\/h[1-6]>/g, '\n');
html = html.replace(/<li[^>]*>/g, '\n- ');
html = html.replace(/<\/(p|div|section|li|tr|br)>/g, '\n');
html = html.replace(/<br\s*\/?>/g, '\n');

// Strip remaining tags
html = html.replace(/<[^>]+>/g, '');

// Decode common entities
const entities = { '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#039;': "'", '&lt;': '<', '&gt;': '>' };
html = html.replace(/&nbsp;|&amp;|&quot;|&#039;|&lt;|&gt;/g, (m) => entities[m]);

// Collapse whitespace
html = html.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
html = html.replace(/\n{2,}/g, '\n');

fs.writeFileSync(process.argv[3] || (file + '.txt'), html);
console.log('wrote', html.split('\n').length, 'lines to', process.argv[3] || (file + '.txt'));
