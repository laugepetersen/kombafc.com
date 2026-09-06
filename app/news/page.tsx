import type { Metadata } from "next";

import { NewsIndex } from "@/components/sections/news-index";

export const metadata: Metadata = {
  title: "News",
  description:
    "Press coverage of KOMBA — every article written about the K.B. Hallen debut, summarised here and linked to the publication that wrote it.",
};

export default function NewsPage() {
  return <NewsIndex />;
}
