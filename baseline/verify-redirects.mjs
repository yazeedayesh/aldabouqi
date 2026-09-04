import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Verifies every rule in vercel.json's redirects list end-to-end against a
// real deployment: chases the full redirect chain (the .html forms take two
// hops — cleanUrls strips .html, then the explicit rule fires) and confirms
// it lands on 200 at the expected destination path, not just that the first
// hop returns a 3xx status.
//
// Needs a Vercel deployment-protection automation-bypass secret to reach a
// protected preview URL (fetched fresh from the Vercel API each run via the
// locally logged-in `vercel` CLI's own auth token — never printed or stored
// in the output file below).
//
// Usage: node verify-redirects.mjs <origin> [--project <id>] [--team <id>]

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORIGIN = process.argv[2];
if (!ORIGIN) {
  console.error("usage: node verify-redirects.mjs <origin>");
  process.exit(1);
}
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "prj_YY5bG716QwQrciWFyLBu6OUomnRl";
const TEAM_ID = process.env.VERCEL_TEAM_ID || "team_pjkdQDTHbrMDoBJ75VuQt8f0";

const authPath = path.join(process.env.APPDATA, "xdg.data", "com.vercel.cli", "auth.json");
const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
const apiRes = await fetch(
  `https://api.vercel.com/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}`,
  { headers: { Authorization: "Bearer " + auth.token } }
);
const project = await apiRes.json();
const bypassSecret = project.protectionBypass
  ? Object.entries(project.protectionBypass).find(([, v]) => v?.scope === "automation-bypass")?.[0]
  : undefined;
if (!bypassSecret) {
  console.error("No automation bypass secret found on project.protectionBypass");
  process.exit(1);
}

const rules = JSON.parse(fs.readFileSync(path.join(__dirname, "crawl/redirects-list.json"), "utf8"));

async function fetchManual(absoluteUrl) {
  const res = await fetch(absoluteUrl, {
    redirect: "manual",
    headers: { "x-vercel-protection-bypass": bypassSecret },
  });
  return { status: res.status, location: res.headers.get("location") };
}

const results = [];
for (const rule of rules) {
  let currentUrl = ORIGIN + rule.source;
  const hopStatuses = [];
  let hop;
  for (let i = 0; i < 4; i++) {
    hop = await fetchManual(currentUrl);
    hopStatuses.push(hop.status);
    if (hop.status >= 300 && hop.status < 400 && hop.location) {
      currentUrl = hop.location.startsWith("http") ? hop.location : ORIGIN + hop.location;
    } else {
      break;
    }
  }
  const finalPath = new URL(currentUrl).pathname;
  results.push({
    source: rule.source,
    expectedDestination: rule.destination,
    hopStatuses,
    finalStatus: hop.status,
    finalPath,
    landedOnExpectedPath: finalPath === rule.destination,
    ok: hop.status === 200 && finalPath === rule.destination,
  });
}

const bad = results.filter((r) => !r.ok);
const badFirstHop = results.filter((r) => r.hopStatuses[0] !== 308);

console.log(`Checked ${results.length} redirect rules against ${ORIGIN}`);
console.log(`Landed on 200 at the expected destination: ${results.length - bad.length}`);
console.log(`Failed: ${bad.length}`);
if (bad.length) console.log("FAILURES:", JSON.stringify(bad, null, 2));
console.log(`First hop was not 308: ${badFirstHop.length}`);
if (badFirstHop.length) console.log("NON-308 FIRST HOP:", JSON.stringify(badFirstHop, null, 2));

fs.writeFileSync(path.join(__dirname, "crawl/new-app-redirects-status.json"), JSON.stringify(results, null, 2));
