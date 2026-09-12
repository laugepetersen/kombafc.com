import type { Metadata } from "next";

import { About, Creed } from "@/components/sections/about";
import { Arena } from "@/components/sections/arena";
import { CoFounders } from "@/components/sections/co-founders";
import { Founder } from "@/components/sections/founder";
import { Ruleset } from "@/components/sections/ruleset";

export const metadata: Metadata = {
  title: "About",
  description:
    "All strikers, one arena. KOMBA is a unique experience where the best strikers in all combat sports clash to put on an entertaining show — built in Copenhagen by Youssef Assouik, Lauge Milling Petersen and Houdaifa Harrar.",
};

/**
 * The order is the argument, and it runs in two movements.
 *
 * **What it is** — the claim, the vision, then the two blocks that actually
 * cash them: why the sports never meet, and what the rule set does about it.
 * Both answer a phrase the page used to state and leave standing.
 *
 * **Who is behind it** — the creed, the two co-founders, and then Youssef
 * Assouik at the length a front figure is owed. Deliberately after the
 * argument: a reader who has just been told what KOMBA is is ready to be told
 * who is doing it, where the reverse order asks them to care about three names
 * before they know what the names are for. It runs up the scale as well —
 * chips became half-size portrait blocks, and his is the whole one.
 */
export default function AboutPage() {
  return (
    <>
      <About />
      <Arena />
      <Ruleset />
      <Creed />
      <CoFounders />
      <Founder />
    </>
  );
}
