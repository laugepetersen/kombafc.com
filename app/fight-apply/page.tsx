import type { Metadata } from "next";

import { FightApplyPage } from "@/components/sections/fight-apply";

export const metadata: Metadata = {
  title: "Fight Apply",
  description:
    "KOMBA is looking for strikers. Every striking sport, one ring, one format — tell us who you are and we will watch.",
};

export default function Page() {
  return <FightApplyPage />;
}
