// Client-only "interest list" (brief §6.3) — replaces a cart since there's
// no checkout for price-on-request items. Plain localStorage, no account,
// no server round-trip; a same-tab custom event keeps every mounted
// consumer (product cards, the floating bar) in sync since the native
// "storage" event only fires in *other* tabs.

export type InterestItem = {
  slug: string;
  category: string;
  titleAr: string;
  titleEn: string;
};

const STORAGE_KEY = "aldabouqi:interest-list";
const EVENT_NAME = "aldabouqi:interest-list-change";

// useSyncExternalStore requires getSnapshot to return a referentially stable
// value when nothing changed — returning a fresh JSON.parse() array on every
// call (as this used to) makes React think the store changes on every
// render, causing an infinite re-render loop. This cache is the fix: it's
// only replaced when the data actually changes (write(), or a storage event
// from another tab), never on a plain read.
let cache: InterestItem[] | null = null;

function loadFromStorage(): InterestItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as InterestItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function getAll(): InterestItem[] {
  return cache ?? loadFromStorage();
}

function write(items: InterestItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  cache = items;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export const interestList = {
  getAll,
  has(slug: string) {
    return getAll().some((item) => item.slug === slug);
  },
  add(item: InterestItem) {
    const items = getAll();
    if (items.some((i) => i.slug === item.slug)) return;
    write([...items, item]);
  },
  remove(slug: string) {
    write(getAll().filter((item) => item.slug !== slug));
  },
  toggle(item: InterestItem) {
    if (interestList.has(item.slug)) {
      interestList.remove(item.slug);
    } else {
      interestList.add(item);
    }
  },
  clear() {
    write([]);
  },
  subscribe(callback: () => void) {
    // A storage event means another tab wrote new data — invalidate the
    // cache so the next getAll() re-reads instead of returning our stale copy.
    const onStorage = () => {
      cache = null;
      callback();
    };
    window.addEventListener(EVENT_NAME, callback);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, callback);
      window.removeEventListener("storage", onStorage);
    };
  },
};
