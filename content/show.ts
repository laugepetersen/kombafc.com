import type { ShowFact } from "@/components/ui/show-bar";

/**
 * KOMBA 1.0 at K.B. Hallen, in three lines.
 *
 * Here rather than inside a section because two of them now carry the same
 * bar — the hero and the flythrough — and a fact that has to be true in two
 * places should not be typed in two places. The type stays with the component
 * that renders it; only the content lives here.
 */
export const showFacts: ShowFact[] = [
  { label: "A World Champion", detail: "and two European at stake." },
  { label: "1500 Spectators", detail: "and more broadcasting" },
  { label: "KUNDO x G-SHOCK", detail: "Halftime show" },
];
