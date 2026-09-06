import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticle } from "@/components/sections/news-article";
import { news, newsItemBySlug, outlets } from "@/content/news";

/** The list is the whole of it, so every page is built at build time. */
export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(
  props: PageProps<"/news/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = newsItemBySlug(slug);

  if (!item) return {};

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: item.published,
    },
    // No cross-domain canonical, deliberately — it was here and it was wrong.
    // A canonical says "this page is a copy of that one", and a search engine
    // that believes it drops ours from the index entirely. These pages are not
    // copies: the prose is ours, written from the article and in another
    // language. What credits the original is `isBasedOn` below, plus the link
    // and the mark on the page itself, and none of those cost KOMBA the page.
  };
}

export default async function NewsItemPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const item = newsItemBySlug(slug);

  if (!item) notFound();

  return (
    <>
      {/* Marked up as a report *about* an article rather than as the article,
          with `isBasedOn` naming the original and the outlet as its publisher.
          Same statement as the canonical above, in the vocabulary that puts a
          credit in a rich result. */}
      {item.kind === "coverage" ? (
        <script
          type="application/ld+json"
          // The only way to emit JSON-LD. The value is serialised from our own
          // content file, never from anything a request carries.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: item.title,
              datePublished: item.published,
              description: item.summary,
              isBasedOn: {
                "@type": "NewsArticle",
                headline: item.sourceHeadline,
                url: item.sourceUrl,
                author: { "@type": "Person", name: item.byline },
                publisher: {
                  "@type": "Organization",
                  name: outlets[item.outlet].name,
                  url: outlets[item.outlet].home,
                },
              },
            }),
          }}
        />
      ) : null}

      <NewsArticle item={item} />
    </>
  );
}
