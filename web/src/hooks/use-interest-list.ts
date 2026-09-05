"use client";

import { useSyncExternalStore } from "react";
import { interestList, type InterestItem } from "@/lib/interest-list";

const emptyItems: InterestItem[] = [];

/** Subscribes to the localStorage-backed interest list via useSyncExternalStore
 * — the correct primitive for an external mutable store, and SSR-safe (the
 * server snapshot is always empty since localStorage doesn't exist there). */
export function useInterestList() {
  const items = useSyncExternalStore(
    interestList.subscribe,
    interestList.getAll,
    () => emptyItems
  );

  return {
    items,
    hydrated: typeof window !== "undefined",
    has: (slug: string) => items.some((item) => item.slug === slug),
    toggle: interestList.toggle,
    remove: interestList.remove,
    clear: interestList.clear,
  };
}
