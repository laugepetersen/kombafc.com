import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const typeScale = [
  { token: "text-7xl", cls: "text-7xl" },
  { token: "text-6xl", cls: "text-6xl" },
  { token: "text-5xl", cls: "text-5xl" },
  { token: "text-4xl", cls: "text-4xl" },
  { token: "text-3xl", cls: "text-3xl" },
  { token: "text-2xl", cls: "text-2xl" },
  { token: "text-xl", cls: "text-xl" },
  { token: "text-lg", cls: "text-lg" },
  { token: "text-base", cls: "text-base" },
  { token: "text-sm", cls: "text-sm" },
  { token: "text-xs", cls: "text-xs" },
];

const swatches = [
  { name: "komba-purple", cls: "bg-komba-purple" },
  { name: "komba-yellow", cls: "bg-komba-yellow" },
  { name: "ink-600", cls: "bg-ink-600" },
  { name: "ink-700", cls: "bg-ink-700" },
  { name: "ink-800", cls: "bg-ink-800" },
  { name: "ink-900", cls: "bg-ink-900" },
  { name: "ink-950", cls: "bg-ink-950" },
];

export default function FoundationPage() {
  return (
    <main>
      <Section spacing="lg" className="border-b border-white/10">
        <p className="text-komba-purple font-heading text-sm tracking-[0.2em] uppercase">
          v2 foundation
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase italic md:text-7xl">
          The best strikers.
          <br />A new fight format.
        </h1>
        <p className="mt-6 max-w-[45ch] text-lg text-white/60">
          Scaffold check — type scale, container widths, section rhythm and
          brand palette. Everything here is token-driven.
        </p>
      </Section>

      <Section spacing="md" className="border-b border-white/10">
        <h2 className="text-2xl font-bold uppercase">
          Type scale <span className="text-white/40">— major third, 1.250</span>
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {typeScale.map(({ token, cls }) => (
            <div key={token} className="flex items-baseline gap-6">
              <code className="text-komba-yellow/70 w-24 shrink-0 font-mono text-xs">
                {token}
              </code>
              <span className={`${cls} font-heading truncate`}>
                Komba Fight Club
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="md" className="border-b border-white/10">
        <h2 className="text-2xl font-bold uppercase">Palette</h2>
        <div className="mt-8 flex flex-wrap gap-4">
          {swatches.map(({ name, cls }) => (
            <div key={name} className="flex flex-col gap-2">
              <div
                className={`${cls} size-24 rounded-md ring-1 ring-white/15`}
              />
              <code className="font-mono text-xs text-white/50">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="md" container={false}>
        <Container>
          <h2 className="text-2xl font-bold uppercase">Container widths</h2>
        </Container>

        <div className="mt-8 flex flex-col gap-3">
          {(["narrow", "default", "wide"] as const).map((width) => (
            <Container key={width} width={width}>
              <div className="bg-komba-purple/20 border-komba-purple/40 rounded border border-dashed px-4 py-3 text-center font-mono text-xs">
                {width}
              </div>
            </Container>
          ))}
        </div>
      </Section>
    </main>
  );
}
