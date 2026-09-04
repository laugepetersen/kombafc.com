"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * Whether the page has scrolled past `threshold`.
 *
 * Returns a boolean rather than the offset, so React only re-renders on the
 * crossing rather than on every scroll event.
 */
export function useScrolled(threshold = 24) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false, // server: always treat as at-rest so hydration matches
  );
}
