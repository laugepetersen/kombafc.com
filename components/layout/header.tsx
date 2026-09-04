"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Fighters", href: "/fighters" },
  { label: "Partners", href: "/partners" },
];

/** Shared by the desktop rail and the mobile panel so the two cannot drift. */
const navLinkClass =
  "font-body text-sm tracking-[0.06em] text-white/80 uppercase transition-[color,opacity] duration-200 hover:text-white";

/**
 * Wordmark geometry, in the SVG's own units. The K mark occupies x 0–28.44 and
 * the lettering starts around x 41.8, so cropping the container down to the
 * mark's width hides the word cleanly without touching the asset.
 */
const WORDMARK_FULL = 126.15;
const WORDMARK_MARK_ONLY = 28.44;

/**
 * 1px rule between pill segments.
 *
 * Must stay a *direct* flex child of the row: `self-stretch` is what gives it
 * its height, and that only resolves against the row's cross axis. Wrapping it
 * in a plain div collapses it to zero, which is exactly how both rules went
 * missing before.
 */
function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-px self-stretch bg-white/10", className)}
      aria-hidden="true"
    />
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  // The pill floats over the hero, so an open panel must not be left behind
  // when the viewport grows back to the desktop layout.
  useEffect(() => {
    if (!menuOpen) return;

    const mq = window.matchMedia("(min-width: 48rem)");
    const close = () => setMenuOpen(false);

    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      {/* Full-bleed scrim behind the pill, solid at the very top and fading
          out below it, so content scrolling up dissolves into the page edge
          instead of sliding under a hard line. Sits before the pill in the DOM,
          so it stays behind it without needing a z-index. */}
      <div
        aria-hidden="true"
        className="from-void/80 pointer-events-none fixed inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
      />

      <nav
        className={cn(
          // An inset ring rather than a border: the pill is 56px in the comp,
          // and a border would add its 2px on top of the 56px row.
          "flex flex-col bg-white/5 inset-ring-1 inset-ring-white/10 backdrop-blur-[12px]",
          "max-md:w-full max-md:max-w-sm",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center",
            // While any item is hovered, every *other* item dims. Scoped with
            // :not(:hover) so the hovered one needs no competing override.
            "[&:has([data-nav-item]:hover)_[data-nav-item]:not(:hover)]:opacity-40",
          )}
        >
          {/* Logo sits in the same segment as the links, on the same gap,
              so the wordmark reads as the first nav item rather than as a
              separate badge. Only the menu button gets its own box. */}
          <div className="flex h-full items-center gap-7 px-6">
            <Link
              href="/"
              data-nav-item
              className="flex h-full items-center transition-opacity duration-200"
              aria-label="KOMBA Fight Club — home"
            >
              <span
                className="block overflow-hidden transition-[width] duration-500 ease-out"
                style={{ width: scrolled ? WORDMARK_MARK_ONLY : WORDMARK_FULL }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
                    brand mark; next/image adds a wrapper and a second hop for an
                    SVG it will not optimise anyway. */}
                <img
                  src="/brand/komba-wordmark.svg"
                  alt=""
                  width={126}
                  height={12}
                  // max-w-none defeats the global `img { max-width: 100% }`, which
                  // would squash the mark rather than crop the word.
                  className="h-3 w-[126.15px] max-w-none"
                />
              </span>
            </Link>

            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                data-nav-item
                className={cn(navLinkClass, "max-md:hidden")}
              >
                {label}
              </Link>
            ))}
          </div>

          <Divider className="max-md:hidden" />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            data-nav-item
            className="flex h-full items-center px-6 transition-opacity duration-200 max-md:ml-auto"
          >
            <Icon name="apps" className="size-8" />
          </button>
        </div>

        {menuOpen ? (
          <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 md:hidden">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
