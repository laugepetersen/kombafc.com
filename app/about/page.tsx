import type { Metadata } from "next";

import { About, Creed } from "@/components/sections/about";
import { Arena } from "@/components/sections/arena";
import { Experience } from "@/components/sections/experience";
import { Founder } from "@/components/sections/founder";
import { Press } from "@/components/sections/press";
import { Ruleset } from "@/components/sections/ruleset";
import { Stories } from "@/components/sections/stories";

export const metadata: Metadata = {
  title: "About",
  description:
    "All strikers, one arena. KOMBA is a unique experience where the best strikers in all combat sports clash to put on an entertaining show — built in Copenhagen by Youssef Assouik, Lauge Milling Petersen and Houdaifa Harrar.",
};

/**
 * The order is the argument, and it runs in three movements.
 *
 * **What it is** — the claim, the vision, then the three blocks that actually
 * cash them: why the sports never meet, what the rule set does about it, and
 * what the night is built like. Every one of those answers a phrase the page
 * used to state and leave standing.
 *
 * **Who is behind it** — the creed, the three names, and then Youssef Assouik
 * at the length a front figure is owed. Deliberately after the argument: a
 * reader who has just been told what KOMBA is is ready to be told who is doing
 * it, where the reverse order asks them to care about three names before they
 * know what the names are for.
 *
 * **Somebody else saying it** — the press wall, and then the room's own
 * footage. The page ends on the two things it did not write itself.
 */
export default function AboutPage() {
  return (
    <>
      <About />
      <Arena />
      <Ruleset />
      <Experience />
      <Creed />
      <Founder />
      <Press />
      <Stories />
    </>
  );
}
