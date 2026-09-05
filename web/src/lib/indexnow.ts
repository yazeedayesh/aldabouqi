import { SITE_URL } from "@/lib/constants";

// Key file lives at public/<key>.txt, served at {SITE_URL}/<key>.txt — the
// IndexNow key location Bing/other participating engines verify against.
const INDEXNOW_KEY = "599e56a15a47a9d24940363fd5d04b5b";

/**
 * Fire-and-forget ping to IndexNow (brief §10.5) after a product is
 * created/updated so participating search engines pick up the change
 * faster than waiting on the next sitemap crawl. Never awaited by callers —
 * a failed ping must never block or fail an admin save.
 */
export function pingIndexNow(paths: string[]) {
  if (paths.length === 0) return;
  const host = new URL(SITE_URL).host;

  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: paths.map((path) => `${SITE_URL}${path}`),
    }),
  }).catch(() => {});
}
