import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";
import { Button } from "@/components/ui/button";

/**
 * The one hold page that does not ask for an address, because it is the page
 * somebody opened in order to give us theirs. Told "we'll be in touch" by the
 * Contact link, a reader has been sent in a circle.
 *
 * So the call to action is the address itself rather than a word standing in
 * for it: it can be read, copied and typed into whatever that person actually
 * writes mail in, and it still opens a composer for the ones who click.
 *
 * A guess, like the partners inbox is a guess — nothing in this repo has ever
 * been told what the general address is. `partners@kombafc.com` is the only
 * one written down anywhere and it is not this one; a business tier's inbox
 * answering "where do I send anything at all" is the wrong door held open.
 * See the note in partners.tsx, and change both in one go if the domain's
 * mail is set up differently.
 */
const CONTACT = "hello@kombafc.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach KOMBA directly. Press, bookings, partnerships and everything else — one address, and a person on the other end of it.",
};

export default function ContactPage() {
  return (
    <HoldPage
      kicker="Open channel"
      lines={[
        "There is no front desk.",
        "There is a direct line.",
        "Write, and we answer.",
      ]}
    >
      {/* The address, set as the CTA. It is the longest label any button on
          the site carries, which is the point — the label is the information,
          and shortening it to "Email us" would hide the one thing this page
          exists to hand over. */}
      <Button href={`mailto:${CONTACT}`}>{CONTACT}</Button>
    </HoldPage>
  );
}
