"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

/**
 * A column of photographs, one at a time, crossfading.
 *
 * Ambience and nothing else — it carries no information, so it is `aria-hidden`
 * and every frame has an empty alt. What it is there for is to stop a long form
 * being a form on a black page.
 *
 * Every frame is mounted and stacked; only opacity moves. A slideshow that
 * swaps `src` reloads on every turn and shows the gap while it does, and at
 * this size the whole set is a few hundred kilobytes — cheaper to hold than to
 * re-fetch. The first is `priority`, since it is above the fold beside the
 * first step; the rest come in lazily behind it.
 *
 * It only runs while somebody could be looking: off screen or in a hidden tab
 * it stops, the way the hero's deck and the dot field do. And under reduced
 * motion it never starts — a crossfade is exactly what that setting is about —
 * so the first frame simply stays.
 */
export function AmbientImages({
  images,
  intervalMs = 4500,
  sizes,
  className,
}: {
  images: { src: string; alt?: string }[];
  /** How long a frame holds before the next comes up. */
  intervalMs?: number;
  sizes: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;

    const el = ref.current;
    if (!el) return;

    let id: ReturnType<typeof setInterval> | undefined;
    let onScreen = false;

    const sync = () => {
      const run = onScreen && !document.hidden;

      if (run && id === undefined) {
        id = setInterval(
          () => setIndex((i) => (i + 1) % images.length),
          intervalMs,
        );
      } else if (!run && id !== undefined) {
        clearInterval(id);
        id = undefined;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      clearInterval(id);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduceMotion, images.length, intervalMs]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
    >
      {images.map((image, i) => (
        <Image
          key={image.src}
          src={image.src}
          alt=""
          fill
          sizes={sizes}
          priority={i === 0}
          quality={50}
          className={cn(
            // 1200ms, which is long enough to read as a dissolve rather than a
            // cut and short enough that a reader glancing over does not catch
            // the two frames overlapping.
            "object-cover transition-opacity duration-[1200ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
