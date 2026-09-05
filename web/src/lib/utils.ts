import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Isolates the `Date.now()` impurity in its own function so callers in
 * Server Component bodies stay pure per the react-hooks/purity lint rule. */
export function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}
