const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

async function headStatus(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'manual' });
    return { status: res.status, location: res.headers.get('location') || null };
  } catch (e) {
    return { status: 'ERROR', location: e.message };
  }
}

async function main() {
  const sitemapUrls = fs.readFileSync(path.join(baseDir, 'crawl/sitemap-urls.txt'), 'utf8')
    .split('\n').map(s => s.trim()).filter(Boolean);
  const redirects = JSON.parse(fs.readFileSync(path.join(baseDir, 'crawl/redirects-list.json'), 'utf8'));

  const sitemapResults = [];
  for (const url of sitemapUrls) {
    const r = await headStatus(url);
    sitemapResults.push({ url, ...r });
  }
  fs.writeFileSync(path.join(baseDir, 'crawl/sitemap-status.json'), JSON.stringify(sitemapResults, null, 2));

  const redirectResults = [];
  for (const rule of redirects) {
    const src = rule.source;
    if (src.includes(':') || src.includes('(')) {
      redirectResults.push({ source: src, skipped: 'pattern-source-not-directly-testable' });
      continue;
    }
    const url = 'https://www.aldabouqi.com' + src;
    const r = await headStatus(url);
    redirectResults.push({ source: src, expectedDestination: rule.destination, permanent: rule.permanent, ...r });
  }
  fs.writeFileSync(path.join(baseDir, 'crawl/redirects-status.json'), JSON.stringify(redirectResults, null, 2));

  const sitemapBad = sitemapResults.filter(r => r.status !== 200);
  const redirectBad = redirectResults.filter(r => !r.skipped && r.status !== (r.permanent === false ? 302 : 308) && r.status !== 301 && r.status !== 308 && r.status !== 307);

  console.log('Sitemap URLs checked:', sitemapResults.length, '| non-200:', sitemapBad.length);
  console.log('Redirects checked:', redirectResults.length - redirectResults.filter(r=>r.skipped).length, '| skipped(pattern):', redirectResults.filter(r=>r.skipped).length);
  console.log('Redirect anomalies:', redirectBad.length);
  if (sitemapBad.length) console.log('SITEMAP BAD:', JSON.stringify(sitemapBad, null, 2));
  if (redirectBad.length) console.log('REDIRECT BAD:', JSON.stringify(redirectBad, null, 2));
}

main();
