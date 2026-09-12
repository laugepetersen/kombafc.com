import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";
import { Icon } from "@/components/ui/icon";

/**
 * The one hold page that does not ask for an address, because it is the page
 * somebody opened in order to give us theirs. Told "we'll be in touch" by the
 * Contact link, a reader has been sent in a circle.
 *
 * So the calls to action are the addresses themselves rather than a word
 * standing in for them: they can be read, copied and typed into whatever that
 * person actually writes mail in, and they still open a composer for the ones
 * who click.
 *
 * Two desks now, from Lauge, and they are the first real addresses this repo
 * has held — `hello@kombafc.com` was a guess and is gone. Mail for the domain
 * runs on Microsoft 365, which is not visible from here, so whether either
 * mailbox exists yet is the one thing about this page that has not been
 * checked.
 */
type Desk = {
  /** Who the door is for. Not the address said twice — it has to add the bit
      the address cannot, which is which enquiry belongs here. */
  label: string;
  address: string;
};

const DESKS: readonly Desk[] = [
  { label: "Fans & tickets", address: "support@kombafc.com" },
  { label: "Press & partners", address: "partner@kombafc.com" },
];

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach KOMBA FC directly. Support for fans, partnerships and press for everybody else — two addresses, and a person on the other end of both.",
};

export default function ContactPage() {
  return (
    <HoldPage
      // Says what the page is rather than naming a mood. "Open channel" was
      // the latter, and an eyebrow is the one line on a page that has to be
      // literal — it is what a reader checks to know where they have landed.
      kicker="Contact us"
      lines={[
        "There is no front desk.",
        "There are two direct lines.",
        "Write, and we answer.",
      ]}
    >
      {/* One panel with a line each, not two blocks side by side.

          It was a violet fill next to a white one, a small grey label floating
          over each. Three things wrong with it: two filled buttons of equal
          weight make a reader choose before either has said what it is for,
          the white fill outweighed the violet whatever the copy said, and the
          labels sat above the controls associated with them by proximity
          alone.

          So the desks became rows of one object — the switchboard the heading
          above is describing. Each row carries its own label, so the two are
          read together instead of paired by eye, and the violet is down to the
          @ that opens each line. The frosted well is the signup form's, which
          is the treatment every other hold page puts in this slot: this page
          is the one that does not ask for an address, and it should still look
          like it belongs to the same five. */}
      <div className="border-rule w-full border bg-white/5 backdrop-blur-[12px]">
        {DESKS.map((desk, index) => (
          <a
            key={desk.address}
            href={`mailto:${desk.address}`}
            // The label and the address in one string, in reading order. Two
            // elements next to each other in the DOM associate nothing, so a
            // screen reader would otherwise announce an address with no idea
            // which desk it belongs to.
            aria-label={`${desk.label} — ${desk.address}`}
            className={`group flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/5 ${
              // The divider between the two, drawn by the lower row's top
              // edge. One rule at the seam, like every other on the site.
              index > 0 ? "border-rule border-t" : ""
            }`}
          >
            <Icon name="alternate_email" violet className="size-5" />

            {/* Left-aligned inside a centred panel. Centring a label over an
                address sets two ragged edges where the eye wants one, and an
                address is a string to read rather than a title to admire. */}
            <span className="flex min-w-0 flex-col items-start gap-1.5">
              <span className="text-ink-300 font-body text-xs leading-none font-medium tracking-[0.06em] uppercase">
                {desk.label}
              </span>
              <span className="font-body truncate text-base leading-none font-medium text-white">
                {desk.address}
              </span>
            </span>

            {/* Sits out at the end of the row rather than beside the text, so
                both rows end on the same vertical however long the address
                is. Travels on hover in the direction it points. */}
            <Icon
              name="arrow_outward"
              className="text-ink-300 ml-auto size-4 transition-[color,translate] duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-white"
            />
          </a>
        ))}
      </div>
    </HoldPage>
  );
}
