/**
 * Canonical production host. Anything served from a different origin —
 * staging, preview deployments, local dev — is kept out of search indexes.
 */
export const PRODUCTION_HOST = "kombafc.com";

/**
 * Vercel sets `VERCEL_PROJECT_PRODUCTION_URL` to the *project's own*
 * production domain, which differs per project: kombafc.com for the live
 * project, staging.kombafc.com for the staging one. That makes it a reliable
 * discriminator without having to hand-manage an env var in two places.
 *
 * Undefined locally, so local dev is treated as non-canonical and noindexed
 * too — which is what we want.
 */
export const isCanonicalProduction =
  process.env.VERCEL_PROJECT_PRODUCTION_URL === PRODUCTION_HOST ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL === `www.${PRODUCTION_HOST}`;
