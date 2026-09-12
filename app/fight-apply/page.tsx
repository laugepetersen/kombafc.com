import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "Fight Apply",
  description:
    "KOMBA FC is not taking applications yet. Every striking sport, one ring, one format — leave an address and you hear about the open call before it goes out.",
};

/**
 * The seventh hold page, and the reason the shell was written.
 *
 * There was a four-step application form here — name, record, division, gym,
 * a webhook behind it. It asked strikers to put themselves forward for a card
 * that has not been written: a form that takes an application nobody can act
 * on is worse than a closed door, because the person who filled it in is now
 * waiting on an answer.
 *
 * So it says the true thing instead, and takes the one field it can honour.
 * The form itself is in the history at e42dd99 — bring it back whole when the
 * 2.0 call actually opens, rather than rebuilding it.
 */
export default function FightApplyPage() {
  return (
    <HoldPage
      // The old page's eyebrow was "Open call". Inverted rather than replaced,
      // because it is the same two words and it is the whole news.
      kicker="Closed call"
      // No "call" in the lines under a kicker that is one — and the promise is
      // the family's, one door along: get in first, get first pick, get first
      // shot.
      lines={["Applications are not open.", "You’ll get first shot."]}
      // No render of its own, so it takes the shared gallery. See the note on
      // `image` in HoldPage — a page only brings its own backdrop when it has
      // a picture of the thing it is holding, and an application is not a
      // thing you can photograph.
      source="fight-apply-hold"
    />
  );
}
