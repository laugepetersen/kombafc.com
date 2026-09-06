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
    ];
  },
};

export default nextConfig;
