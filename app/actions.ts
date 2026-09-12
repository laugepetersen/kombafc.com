"use server";

/**
 * Announcement signups, from every form on the site that takes an address.
 *
 * It lived under `app/events/` while the hold page there was the only caller.
 * Five now — the four hold pages that take an address, and the footer form on
 * every route — and a shop page importing an events action is a dependency
 * that says something untrue about where the code belongs.
 *
 * It carried a second action underneath, for fighter applications. The form
 * that called it is gone (see `app/fight-apply/page.tsx`), and an exported
 * server action is a live endpoint whether or not anything on the site points
 * at it — so it went with the form rather than sitting here forwarding to a
 * webhook nobody is reading.
 *
 * There is still no mailing list in this repo and there should not be one. The
 * address goes straight to Klaviyo, which is the audience now.
 *
 * It used to POST a bare `{ email, source }` to whatever sat behind
 * `SIGNUP_WEBHOOK_URL`, on the argument that a provider-agnostic hook makes
 * swapping ESPs an environment variable rather than a deploy. The argument
 * does not survive contact with a real one: a raw JSON blob cannot carry
 * marketing consent, cannot trigger a double opt-in, and cannot put anybody on
 * a list — it just files the address somewhere and leaves the actual
 * subscribing to a human. So this speaks Klaviyo's own subscribe endpoint, and
 * the webhook is gone rather than kept as a second path nobody would notice
 * breaking.
 */

/* A "use server" module may only export async functions, so this type is the
   one other thing that can live here — TypeScript erases it, so nothing of it
   reaches the module at runtime. The initial state belongs to the caller. */
export type NotifyState =
  { status: "idle" } | { status: "ok" } | { status: "error"; message: string };

/**
 * Deliberately loose. Anything stricter starts rejecting real addresses —
 * apostrophes, new TLDs, plus-addressing — and the only check that actually
 * proves an address exists is sending to it. This catches the typo and the
 * empty box, which is what a field like this is for.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** RFC 5321's ceiling on a path. Past it, nothing downstream will take it. */
const MAX_LENGTH = 254;

/**
 * Which form the address came from, so a list can be read back as interest in
 * a thing rather than as one undifferentiated pile — the shop hold and the
 * fight-pass hold are different questions and the answers should not merge.
 *
 * It arrives in a hidden field, which means it arrives from the client and is
 * worth exactly as much as anything else that does. So it is not trusted: a
 * lowercase slug and nothing else, short, or it is dropped. Nothing here acts
 * on the value — it is a label on a record — but it is going into somebody
 * else's system and a field this repo never validates is a field that field's
 * owner has to.
 */
const SOURCE = /^[a-z][a-z0-9-]{0,31}$/;

/** A slow provider must not hold a form submission open indefinitely. */
const TIMEOUT_MS = 8000;

const GENERIC_FAILURE =
  "That did not go through. Try again in a moment, or write to us directly.";

/**
 * Bulk Subscribe Profiles — one profile at a time, which is what the site has.
 *
 * This endpoint rather than a profile upsert, because consent is not a field
 * you can set on a profile: Klaviyo deliberately routes it through the
 * subscribe endpoints so every subscription carries a consent record saying
 * when and from where. `POST /api/profile-import` takes custom properties and
 * refuses subscriptions; this one takes subscriptions and refuses properties.
 * A signup form needs the consent, so it is this one.
 */
const SUBSCRIBE_URL =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs";

/**
 * Klaviyo versions its API by release date and pins behaviour to the revision
 * you ask for, so this is a hard-coded date and not a "latest" — the whole
 * point of the header is that the response shape cannot change under a
 * deployed app. 2026-07-15 is the current GA revision; bump it deliberately,
 * against their changelog, never because a newer one exists.
 */
const KLAVIYO_REVISION = "2026-07-15";

/**
 * Klaviyo's own error envelope, as much of it as is worth logging.
 *
 * Every misconfiguration this integration can have — a key without
 * `subscriptions:write`, a list id from the wrong account, a revision that has
 * been retired — comes back as a 400 or a 403 with the reason written out in
 * `detail`. Logging the status alone turns a five-second fix into an
 * afternoon.
 */
type KlaviyoErrors = {
  errors?: { code?: string; detail?: string }[];
};

/** The reasons, joined — or the status on its own if the body is not theirs. */
async function describeFailure(response: Response) {
  try {
    const body = (await response.json()) as KlaviyoErrors;
    const detail = body.errors
      ?.map((error) => error.detail ?? error.code)
      .filter(Boolean)
      .join("; ");

    return detail ? `${response.status} — ${detail}` : String(response.status);
  } catch {
    return String(response.status);
  }
}

export async function subscribeToAnnouncements(
  _previous: NotifyState,
  formData: FormData,
): Promise<NotifyState> {
  /* The honeypot. A field no person can see or tab to, so anything in it came
     from something filling every input on the page. Answered with the same
     success a real signup gets — telling a bot it was caught only teaches it
     what to skip next time. */
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "ok" };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const claimed = String(formData.get("source") ?? "");
  const source = SOURCE.test(claimed) ? claimed : "unknown";

  if (email.length > MAX_LENGTH || !EMAIL.test(email)) {
    return {
      status: "error",
      message: "That does not look like an email address.",
    };
  }

  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    /* Nowhere to put it. The one thing this must never do is answer "you're on
       the list" to an address it has just dropped, so the only latitude is in
       development, where succeeding is what lets the form be worked on at
       all. Anywhere else this is a misconfiguration and reads as one.

       Both or neither, and a half-set pair is the loud case rather than the
       quiet one: a key with no list id would otherwise subscribe people to
       nothing, and that failure looks exactly like success from the browser.
       Named individually in the log, because "one of two variables" is not a
       thing anybody can go and fix. */
    const missing = [!apiKey && "KLAVIYO_API_KEY", !listId && "KLAVIYO_LIST_ID"]
      .filter(Boolean)
      .join(" and ");

    if (process.env.NODE_ENV === "development") {
      console.info(
        `[signup] ${email} (${source}) — ${missing} unset, not sent`,
      );
      return { status: "ok" };
    }

    console.error(`[signup] ${missing} not set — signup refused`);
    return { status: "error", message: GENERIC_FAILURE };
  }

  try {
    const response = await fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: {
        // Their media type, not `application/json` — JSON:API is what the
        // endpoint documents and the body below is shaped to. Untested
        // against a plain JSON content type, because Klaviyo checks the key
        // before it looks at either: a probe with a bad key answers 401 no
        // matter what else is wrong with the request.
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
        revision: KLAVIYO_REVISION,
        // The private key, which is why this is a server action and not a
        // fetch from the form. Klaviyo's client-side subscribe endpoint takes
        // a public key instead, and would mean shipping a public signup
        // endpoint for anybody to POST to at any volume.
        authorization: `Klaviyo-API-Key ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      // SUBSCRIBED, and what that means is set on the list
                      // rather than here: with double opt-in switched on in
                      // Klaviyo this asks for a confirmation mail and the
                      // profile stays pending until they click it. Which is
                      // what the form already says — "watch your inbox" is
                      // true either way.
                      email: { marketing: { consent: "SUBSCRIBED" } },
                    },
                  },
                },
              ],
            },
            // Where the consent came from, verbatim off the form. It lands on
            // the consent record as the custom method detail, which is what
            // Klaviyo's segment builder filters subscription method on — so
            // `store-hold` and `fight-pass-hold` stay separable inside one
            // audience instead of needing a list each.
            //
            // Not a profile property, because this endpoint takes none, and
            // because a property would be overwritten by whichever page
            // somebody signed up from last. A consent record is dated and
            // kept; "where this address came from" is a fact about an event,
            // not about a person.
            custom_source: source,
            // Nothing historical here — every one of these is somebody
            // pressing a button right now, so Klaviyo stamps the consent
            // itself and the opt-in mail goes out. Setting it true is how a
            // migration skips both, and it would silently skip them here too.
            historical_import: false,
          },
          relationships: {
            list: { data: { type: "list", id: listId } },
          },
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    /* 202, not 200: it is a job, and Klaviyo takes it rather than completing
       it on the call. `response.ok` would also pass a 200 or a 204, neither of
       which this endpoint returns — anything but a 202 means the request was
       not what it expected and is worth a log. */
    if (response.status !== 202) {
      console.error(
        `[signup] klaviyo refused: ${await describeFailure(response)}`,
      );
      return { status: "error", message: GENERIC_FAILURE };
    }
  } catch (error) {
    // The address itself stays out of the log: it is somebody's personal data
    // and it is not what went wrong.
    console.error("[signup] klaviyo unreachable", error);
    return { status: "error", message: GENERIC_FAILURE };
  }

  return { status: "ok" };
}
