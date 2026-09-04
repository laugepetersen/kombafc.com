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

const inkRamp = [
  { name: "void", cls: "bg-void" },
  { name: "ink-900", cls: "bg-ink-900" },
  { name: "ink-800", cls: "bg-ink-800" },
  { name: "ink-700", cls: "bg-ink-700" },
  { name: "ink-600", cls: "bg-ink-600" },
  { name: "ink-500", cls: "bg-ink-500" },
  { name: "ink-400", cls: "bg-ink-400" },
  { name: "ink-300", cls: "bg-ink-300" },
  { name: "ink-200", cls: "bg-ink-200" },
  { name: "ink-100", cls: "bg-ink-100" },
];

const violetRamp = [
  { name: "violet-950", cls: "bg-violet-950" },
  { name: "violet-900", cls: "bg-violet-900" },
  { name: "violet-800", cls: "bg-violet-800" },
  { name: "violet-700", cls: "bg-violet-700" },
  { name: "violet-600", cls: "bg-violet-600" },
  { name: "violet-500", cls: "bg-violet-500" },
  { name: "violet-400", cls: "bg-violet-400" },
  { name: "violet-300", cls: "bg-violet-300" },
  { name: "violet-200", cls: "bg-violet-200" },
];

export const metadata = { title: "Foundation" };

export default function FoundationPage() {
  return (
    <main>
      <Section spacing="lg" className="border-ink-800 border-b">
        <p className="font-heading text-sm tracking-[0.2em] text-violet-500 uppercase">
          v2 foundation
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase italic md:text-7xl">
          The best strikers.
          <br />A new fight format.
        </h1>
        <p className="text-ink-200 mt-6 max-w-[45ch] text-lg">
          Scaffold check — type scale, container widths, section rhythm and
          brand palette. Everything here is token-driven.
        </p>
      </Section>

      <Section spacing="md" className="border-ink-800 border-b">
        <h2 className="text-2xl font-bold uppercase">
          Type scale <span className="text-ink-400">— major third, 1.250</span>
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {typeScale.map(({ token, cls }) => (
            <div key={token} className="flex items-baseline gap-6">
              <code className="w-24 shrink-0 font-mono text-xs text-violet-400">
                {token}
              </code>
              <span className={`${cls} font-heading truncate`}>
                Komba Fight Club
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="md" className="border-ink-800 border-b">
        <h2 className="text-2xl font-bold uppercase">Palette</h2>
        {[
          { label: "Ink", ramp: inkRamp },
          { label: "Violet", ramp: violetRamp },
        ].map(({ label, ramp }) => (
          <div key={label} className="mt-8">
            <p className="text-ink-300 mb-3 font-mono text-xs uppercase">
              {label}
            </p>
            <div className="ring-ink-600 flex overflow-hidden rounded-md ring-1">
              {ramp.map(({ name, cls }) => (
                <div key={name} className={`${cls} h-24 flex-1`} />
              ))}
            </div>
            <div className="mt-2 flex">
              {ramp.map(({ name }) => (
                <code
                  key={name}
                  className="text-ink-300 flex-1 font-mono text-[10px]"
                >
                  {name.replace(/^(ink|violet)-/, "")}
                </code>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section spacing="md" container={false}>
        <Container>
          <h2 className="text-2xl font-bold uppercase">Container widths</h2>
        </Container>

        <div className="mt-8 flex flex-col gap-3">
          {(["narrow", "default", "wide"] as const).map((width) => (
            <Container key={width} width={width}>
              <div className="rounded border border-dashed border-violet-500/50 bg-violet-500/15 px-4 py-3 text-center font-mono text-xs">
                {width}
              </div>
            </Container>
          ))}
        </div>
      </Section>
    </main>
  );
}
