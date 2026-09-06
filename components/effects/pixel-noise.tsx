"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Flickering dot matrix, in the spirit of Aceternity's canvas-reveal-effect —
 * but only the noise, and without the reveal or the WebGL stack it rides on.
 *
 * Theirs is a fragment shader hashing each cell to an opacity and stepping it
 * over time. The same read comes off a 2D canvas: hold one opacity and one
 * colour per cell, and churn a slice of them each frame. That drops three
 * dependencies and runs where WebGL is blocked.
 *
 * Cost is kept in hand by drawing at a fixed low frame rate — a shimmer does
 * not read any better at 60fps than at 20 — and by not drawing at all while
 * the canvas is off-screen or the tab is hidden.
 */
type PixelNoiseProps = {
  /** Dot colours, sampled per cell. */
  colors?: string[];
  /** Dot edge length in CSS pixels. */
  dotSize?: number;
  /** Centre-to-centre spacing. Larger than dotSize leaves the grid visible. */
  pitch?: number;
  /** Opacity steps a dot can take. Weighted to the low end reads as sparse. */
  opacities?: number[];
  /** Redraws per second. */
  fps?: number;
  /** Share of cells re-rolled each frame. Higher is busier. */
  churn?: number;
  /** Fades the field out towards the top, as in the reference. */
  fadeUpwards?: boolean;
  /**
   * Runs the loop. False holds the last frame and stops drawing, which is what
   * a hover-triggered field wants — fading a canvas that is still churning
   * behind an opacity of 0 spends the same as showing it.
   */
  enabled?: boolean;
  className?: string;
};

export function PixelNoise({
  colors = ["#7a1fff", "#9d5cff", "#c0a0ff", "#5311c4"],
  dotSize = 2,
  pitch = 6,
  opacities = [0, 0, 0, 0.05, 0.1, 0.2, 0.3, 0.45, 0.6, 0.85],
  fps = 20,
  churn = 0.08,
  fadeUpwards = true,
  enabled = true,
  className,
}: PixelNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read by the loop rather than depended on, so toggling it does not tear the
  // effect down. As a dependency it rebuilt the grid on every hover, which is
  // visible as the pattern jumping the moment the field fades in.
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const colorKey = colors.join();
  const opacityKey = opacities.join();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cols = 0;
    let rows = 0;
    let cellOpacity = new Float32Array(0);
    let cellColor = new Uint8Array(0);
    let frame = 0;
    let onScreen = false;
    let lastDraw = 0;

    const roll = (i: number) => {
      cellOpacity[i] = opacities[(Math.random() * opacities.length) | 0];
      cellColor[i] = (Math.random() * colors.length) | 0;
    };

    const layout = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      // Cap at 2: past that the dots are subpixel and the extra fill is spent
      // on detail nobody can see.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / pitch);
      rows = Math.ceil(height / pitch);
      cellOpacity = new Float32Array(cols * rows);
      cellColor = new Uint8Array(cols * rows);
      for (let i = 0; i < cellOpacity.length; i += 1) roll(i);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);

      for (let y = 0; y < rows; y += 1) {
        // Linear falloff towards the top, so the field has a horizon.
        const depth = fadeUpwards ? (y + 1) / rows : 1;
        for (let x = 0; x < cols; x += 1) {
          const i = y * cols + x;
          const alpha = cellOpacity[i] * depth;
          if (alpha <= 0.01) continue;

          context.globalAlpha = alpha;
          context.fillStyle = colors[cellColor[i]];
          context.fillRect(x * pitch, y * pitch, dotSize, dotSize);
        }
      }
      context.globalAlpha = 1;
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!enabledRef.current || now - lastDraw < 1000 / fps) return;
      lastDraw = now;

      const rolls = Math.round(cellOpacity.length * churn);
      for (let n = 0; n < rolls; n += 1) {
        roll((Math.random() * cellOpacity.length) | 0);
      }
      draw();
    };

    /**
     * The loop is started and stopped rather than left running and skipped.
     *
     * It used to re-arm at the top of `tick` and then early-return, so a field
     * that was off screen or in a hidden tab still woke the main thread sixty
     * times a second to decide against doing anything — and there is one of
     * these per CTA as well as the footer's, so a page carries several. Off
     * screen it now costs nothing at all.
     */
    const sync = () => {
      const run = onScreen && !document.hidden && !reduceMotion;

      if (run && !frame) {
        // Fresh clock. Carrying the old one over means the first frame back
        // is always past its interval, so the field jumps a beat on return.
        lastDraw = 0;
        frame = requestAnimationFrame(tick);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    layout();
    draw();

    // Nothing is spent while the field is scrolled past or the tab is hidden.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);

    // Both directions. This read `visible = !document.hidden && visible`,
    // which is a one-way latch: hide the tab with the footer on screen, come
    // back, and the field stayed dead until it was scrolled off and on again.
    const onVisibility = sync;
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      layout();
      draw();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // Arrays are compared by content, not identity. A caller passing a literal
    // — which is the natural way to write it — would otherwise hand this a new
    // array every render, tearing the grid down and rebuilding it mid-hover.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey, opacityKey, dotSize, pitch, fps, churn, fadeUpwards, enabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none size-full", className)}
    />
  );
}
