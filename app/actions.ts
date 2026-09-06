"use server";

/**
 * Announcement signups, from every form on the site that takes an address.
 *
 * It lived under `app/events/` while the hold page there was the only caller.
 * Six of them now — every route that is still under wraps carries the same
 * form — and a shop page importing an events action is a dependency that says
 * something untrue about where the code belongs.
 *
 * There is no mailing list in this repo and there should not be one: the
 * address goes straight out to whatever service ends up owning it —
 * Resend, Mailchimp, an n8n hook, a Sheet — over a single POST to
 * `SIGNUP_WEBHOOK_URL`. Swapping providers is then an environment variable
 * rather than a deploy.
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

  const endpoint = process.env.SIGNUP_WEBHOOK_URL;

  if (!endpoint) {
    /* Nowhere to put it. The one thing this must never do is answer "you're on
       the list" to an address it has just dropped, so the only latitude is in
       development, where succeeding is what lets the form be worked on at
       all. Anywhere else this is a misconfiguration and reads as one. */
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[signup] ${email} (${source}) — SIGNUP_WEBHOOK_URL is unset, not sent`,
      );
      return { status: "ok" };
    }

    console.error("[signup] SIGNUP_WEBHOOK_URL is not set — signup refused");
    return { status: "error", message: GENERIC_FAILURE };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        source,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`[signup] webhook returned ${response.status}`);
      return { status: "error", message: GENERIC_FAILURE };
    }
  } catch (error) {
    // The address itself stays out of the log: it is somebody's personal data
    // and it is not what went wrong.
    console.error("[signup] webhook failed", error);
    return { status: "error", message: GENERIC_FAILURE };
  }

  return { status: "ok" };
}
