import type { MetadataRoute } from "next";

import { isCanonicalProduction } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging is publicly reachable by choice, so it has to be explicitly
  // excluded from crawlers rather than relying on obscurity.
  if (!isCanonicalProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return { rules: { userAgent: "*", allow: "/" } };
}
