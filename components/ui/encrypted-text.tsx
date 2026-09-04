"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * Text that lands scrambled and decrypts left to right once it scrolls into
 * view.
 *
 * Rewritten from Aceternity's encrypted-text rather than vendored as-is. Theirs
 * kept the scramble in a ref and read it during render, which React forbids;
 * it also tagged the output `role="text"`, which is Safari-only and not in the
 * ARIA spec, and had no reduced-motion path. Behaviour and props are the same.
 *
 * Renders the real string on the server and until it first scrolls in, so a
 * client that never runs this — or a crawler — sees finished text rather than
 * noise. After that it re-runs on every entry, parking scrambled while out of
 * view so the next entry starts from noise rather than flashing the answer.
 */
const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function scrambleOf(text: string, charset: string) {
  let out = "";
  for (const ch of text) {
    out +=
      ch === " " ? " " : charset[Math.floor(Math.random() * charset.length)];
  }
  return out;
}

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type EncryptedTextProps = {
  text: string;
  className?: string;
  /** Milliseconds between each character resolving. Lower is faster. */
  revealDelayMs?: number;
  /** Milliseconds between re-rolls of the unresolved characters. */
  flipDelayMs?: number;
  charset?: string;
};

export function EncryptedText({
  text,
  className,
  revealDelayMs = 120,
  flipDelayMs = 120,
  charset = DEFAULT_CHARSET,
}: EncryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Not `once`: the run repeats every time the label comes back into view.
  const inView = useInView(ref, { amount: 0.6 });

  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );

  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    let raf = 0;
    const start = performance.now();
    let lastFlip = start;
    let scramble = scrambleOf(text, charset);

    const tick = (now: number) => {
      const revealed = Math.min(
        text.length,
        Math.floor((now - start) / Math.max(1, revealDelayMs)),
      );

      if (now - lastFlip >= Math.max(0, flipDelayMs)) {
        scramble = scrambleOf(text, charset);
        lastFlip = now;
      }

      setDisplay(text.slice(0, revealed) + scramble.slice(revealed));
      if (revealed < text.length) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      // Park it scrambled on the way out. Leaving the settled string there
      // would flash it for a frame on re-entry, before the next run starts.
      setDisplay(scrambleOf(text, charset));
    };
  }, [inView, reduceMotion, text, charset, revealDelayMs, flipDelayMs]);

  return (
    <span ref={ref} className={cn(className)}>
      {/* The settled string, for assistive tech, so nothing has to read the
          churn. The animated copy is hidden from it entirely. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
