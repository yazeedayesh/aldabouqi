const fs = require('fs');
const file = process.argv[2];
const out = process.argv[3];
const html = fs.readFileSync(file, 'utf8');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(m => JSON.parse(m[1]));
fs.writeFileSync(out, JSON.stringify(blocks, null, 2));
