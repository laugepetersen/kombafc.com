import { Section } from "@/components/layout/section";
import { Hero } from "@/components/sections/hero";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* SCAFFOLDING — temporary height so the scrolled header state can be
          exercised. Delete once the real sections below the hero land. */}
      {["The Ressurect", "Partners", "Events"].map((label) => (
        <Section key={label} spacing="lg" className="border-ink-800 border-b">
          <p className="font-heading text-sm tracking-[0.2em] text-violet-500 uppercase">
            Placeholder
          </p>
          <h2 className="text-chrome mt-4 text-3xl font-black uppercase italic md:text-5xl">
            {label}
          </h2>
          <p className="text-ink-200 mt-6 max-w-[45ch]">
            Temporary block so the page scrolls. The header collapses to just
            the K mark once you pass 24px.
          </p>
          <div className="to-ink-900 inset-ring-ink-700 mt-10 h-64 rounded-lg bg-gradient-to-br from-violet-950 inset-ring-1" />
        </Section>
      ))}
    </>
  );
}
