import type { Metadata } from "next";

import { WatchIndex } from "@/components/sections/watch-index";

export const metadata: Metadata = {
  title: "Watch",
  description:
    "Every fight from KOMBA 1.0 at K.B. Hallen, 11 October 2025 — the main event and nine more, in full.",
};

export default function WatchPage() {
  return <WatchIndex />;
}
