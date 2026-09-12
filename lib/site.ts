/**
 * Canonical production host. Anything served from a different origin —
 * staging, preview deployments, local dev — is kept out of search indexes.
 */
export const PRODUCTION_HOST = "kombafc.com";

/**
 * Two conditions, and the first one is the fix for a hole the project merge
 * opened.
 *
 * This used to test `VERCEL_PROJECT_PRODUCTION_URL` alone, on the reasoning
 * that it is the *project's own* production domain and so differs per project
 * — kombafc.com on the live one, staging.kombafc.com on the staging one. That
 * was true while staging was a separate Vercel project. It is not any more:
 * staging.kombafc.com is a branch domain on this project, so every staging
 * build reads the same `www.kombafc.com` the production build does, and the
 * check returned true for both. Measured on the live staging host — it served
 * `Allow: /`, which invites Google to index a second copy of the whole site
 * and compete with the real one.
 *
 * `VERCEL_ENV` is the discriminator that survives the merge: `production` only
 * for the production deployment, `preview` for every branch build including
 * staging. The host check stays behind it, so a fork or a renamed project does
 * not start indexing itself on the strength of the environment name alone.
 *
 * Both are undefined locally, so local dev is non-canonical and noindexed too
 * — which is what we want.
 */
export const isCanonicalProduction =
  process.env.VERCEL_ENV === "production" &&
  (process.env.VERCEL_PROJECT_PRODUCTION_URL === PRODUCTION_HOST ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL === `www.${PRODUCTION_HOST}`);
