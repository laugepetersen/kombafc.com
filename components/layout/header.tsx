"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Fighters", href: "/fighters" },
  { label: "Partners", href: "/partners" },
];

/** Shared by the desktop rail and the mobile panel so the two cannot drift. */
const navLinkClass =
  "font-body text-sm tracking-[0.06em] text-white/80 uppercase transition-colors hover:text-white";

/** 1px hairline between pill segments. */
function Divider() {
  return <div className="w-px self-stretch bg-white/10" aria-hidden="true" />;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <nav
        className={cn(
          // An inset ring rather than a border: the pill is 56px in the comp,
          // and a border would add its 2px on top of the 56px row.
          "flex flex-col bg-white/5 inset-ring-1 inset-ring-white/10 backdrop-blur-[12px]",
          "max-md:w-full max-md:max-w-sm",
        )}
      >
        <div className="flex h-14 items-center">
          <Link
            href="/"
            className="flex h-full items-center px-6 transition-opacity hover:opacity-80"
            aria-label="KOMBA Fight Club — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
                brand mark; next/image adds a wrapper and a second hop for an
                SVG it will not optimise anyway. */}
            <img
              src="/brand/komba-wordmark.svg"
              alt=""
              width={126}
              height={12}
              className="h-3 w-[126.15px]"
            />
          </Link>

          {/* Segment rules only read as rules when segments sit side by side.
              On mobile the bar collapses to logo-left / menu-right, so they go. */}
          <div className="max-md:hidden">
            <Divider />
          </div>

          <div className="flex items-center gap-7 px-12 max-md:hidden">
            {navItems.map(({ label, href }) => (
              <Link key={href} href={href} className={navLinkClass}>
                {label}
              </Link>
            ))}
          </div>

          <div className="max-md:hidden">
            <Divider />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-full items-center px-6 transition-opacity hover:opacity-70 max-md:ml-auto"
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
