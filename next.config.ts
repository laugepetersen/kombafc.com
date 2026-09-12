import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * 75 is next/image's default and what every content image takes. 50 is for
     * the show corridor, which is a hundred photographs drifting past behind a
     * scrim at up to 55% — measured, the field is 570KB a page at 75, and none
     * of it is ever looked at squarely. Anything not on this list is refused
     * outright rather than silently served at the default, so a `quality` prop
     * added later has to be declared here to work at all.
     */
    qualities: [50, 75],

    /**
     * AVIF first, WebP behind it. Next content-negotiates on the Accept
     * header, so a browser that cannot read AVIF is served the WebP it
     * already got — no fallback to maintain, and nothing to feature-detect.
     *
     * Measured on this site's own images, same URLs and same quality:
     *
     *   /show/show-02  q50   42.0KB -> 18.4KB   -56%
     *   /show/show-04  q50   39.3KB -> 15.8KB   -60%
     *   /show/show-18  q50   41.7KB -> 21.6KB   -48%
     *   /ressurect     q75   95.7KB -> 57.7KB   -40%
     *   /watch thumb   q75   52.3KB -> 31.5KB   -40%
     *                       ------------------
     *                        265KB  -> 142KB    -47%
     *
     * The home page ships about a megabyte of photography — the show corridor
     * is a hundred cards off a couple of dozen sources, all eager because they
     * share one pinned screen — so this is the single biggest saving available
     * without touching a design decision.
     *
     * Checked rather than assumed: the 40% off `ressurect` at q75 costs
     * nothing visible, and the dark purple gradients band *less* than the WebP
     * does. AVIF encodes slower than WebP, which is a cost paid once per size
     * on the optimizer and never by a visitor.
     */
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      {
        /**
         * The store was `/shop` until the route was renamed to match what the
         * nav has always called it. Permanent, because the page it points at
         * is the same page under a better name — and cheap, because a link
         * that got out of the building before the rename is the one link
         * nobody will think to check.
         */
        source: "/shop",
        destination: "/store",
        permanent: true,
      },
      {
        /**
         * Both renamed for the same reason /shop was: the nav has called them
         * Athletes and Partnerships since the first draft, and the URL was
         * still saying something else. Permanent, and the same argument — the
         * page is the page, and a link that left the building before the
         * rename is the one nobody thinks to check.
         *
         * `/fighters` is only the route. `public/fighters/` and the portrait
         * paths in content/fighters.ts keep the word: those are files, not a
         * page, and a redirect on a URL prefix that also serves images is a
         * good way to lose thirteen photographs.
         */
        source: "/fighters",
        destination: "/athletes",
        permanent: true,
      },
      {
        source: "/partners",
        destination: "/partnerships",
        permanent: true,
      },

      /**
       * The three above are v2 renaming itself. These are the ones that carry
       * v1's live URLs across the domain move — every path the old site links
       * to that v2 does not answer on:
       *
       *   /            /about   /contact   /events     unchanged
       *   /fighters -> /athletes                       covered above
       *   /sponsors -> /partnerships                   here
       *
       * `/sponsor` and `/apply` are linked from v1's markup without ever
       * having had a page behind them. They 404 today, so nothing is being
       * preserved — but they are the two spellings a hand-typed or
       * copy-pasted link is most likely to arrive on, and answering them
       * costs one line each.
       *
       * Exact sources, not prefixes, and that matters more here than it did
       * for /fighters: `public/sponsors/` is where the seven partner logos
       * live. `/sponsors` matches the page and nothing under it, so
       * /sponsors/g-shock.svg is still an SVG rather than a redirect to a
       * page that has no logos on it.
       */
      {
        source: "/sponsors",
        destination: "/partnerships",
        permanent: true,
      },
      {
        source: "/sponsor",
        destination: "/partnerships",
        permanent: true,
      },
      {
        source: "/apply",
        destination: "/fight-apply",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
