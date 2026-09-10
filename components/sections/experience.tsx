import Image from "next/image";

import { Section } from "@/components/layout/section";
import { SectionFrame } from "@/components/layout/section-frame";
import { Icon, type IconName } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * The half of a KOMBA night that is not a fight.
 *
 * The home page's format grid says "halftime shows" and "lights, volume &
 * experience" on two cards and leaves it there. This is the argument under
 * them: that the production is not decoration bolted onto a fight card, it is
 * the reason a card with fifteen bouts on it never has a flat hour in it.
 *
 * Three parts, in the order the argument runs. The prose ranges right, which
 * is the only block on the page that does — the format grid on the home page
 * makes the same turn, and after five left-ranged blocks in a row the page
 * needs one. Then the collage, which is the claim in pictures: the gallery on
 * this site is all fighters, and none of it shows the desk, the walkout or the
 * people in the seats. Then the specification, and the night it was measured
 * on.
 *
 * PLACEHOLDER: the copy is written here, not given by Lauge. The numbers are
 * not placeholders — every one of them is already established somewhere in the
 * repo and the source is on the entry.
 */

type Frame = {
  src: string;
  alt: string;
  /** Column span from lg, as a literal utility — Tailwind scans source text. */
  span: string;
  position?: string;
  sizes: string;
};

/**
 * Four frames, none of them a fight.
 *
 * That is the whole selection rule. Every other picture on this site is two
 * people hitting each other; the case this block is making is that the night
 * is bigger than that, and it cannot be made with more of the same photograph.
 * So: the desk, the walkout, the moment before, and the room.
 *
 * Spans alternate 7/5 then 5/7, so the two rows mirror rather than stack into
 * a column with a step in it.
 */
const frames: Frame[] = [
  {
    src: "/show/show-27.webp",
    alt: "A producer at the vision-mixing desk during KOMBA 1.0, headphones on, the printed fight card propped beside the monitor",
    span: "lg:col-span-7",
    position: "object-center",
    sizes: "(min-width: 1280px) 736px, (min-width: 768px) 50vw, 100vw",
  },
  {
    src: "/show/show-23.webp",
    alt: "A fighter in a mongkhon looking out through the ropes under purple light",
    span: "lg:col-span-5",
    position: "object-[60%_50%]",
    sizes: "(min-width: 1280px) 528px, (min-width: 768px) 50vw, 100vw",
  },
  {
    src: "/show/show-10.webp",
    alt: "A fighter walking out under purple light in a mongkhon and prajioud, the crowd behind her",
    span: "lg:col-span-5",
    position: "object-[55%_40%]",
    sizes: "(min-width: 1280px) 528px, (min-width: 768px) 50vw, 100vw",
  },
  {
    src: "/show/show-18.webp",
    alt: "Two spectators at ringside watching a bout at K.B. Hallen",
    span: "lg:col-span-7",
    // A 4:5 frame in a 3:2 box loses two thirds of its height, and the faces
    // are in the upper half of it.
    position: "object-[50%_25%]",
    sizes: "(min-width: 1280px) 736px, (min-width: 768px) 50vw, 100vw",
  },
];

type Pillar = { title: string; body: string; icon: IconName };

/**
 * What the production actually consists of.
 *
 * Written as four rows rather than four cards on purpose: the format grid is
 * already four cards, and this is the level of detail underneath it. A row
 * carries a longer body than a card can without the picture behind it going to
 * waste.
 */
const pillars: Pillar[] = [
  {
    title: "A show inside the show",
    body: "KUNDO and G-SHOCK opened the first one. Every card carries an act of its own, staged in the break rather than played over it — the half hour that usually empties a venue is the half hour we programme hardest.",
    icon: "theaters",
  },
  {
    title: "Lights, screens and VFX",
    body: "The ring is lit as a stage and the room is lit around it. Digital screens carry the card, the scoring and the walkouts, so what a phone films from row twelve looks like what the broadcast sees.",
    icon: "graphic_eq",
  },
  {
    title: "Built for the camera too",
    body: "Every card is produced as a live broadcast, not filmed as an afterthought. Camera positions are set before a single fighter is booked, and the run of the night is cut to work for the room and the stream at once.",
    icon: "videocam",
  },
  {
    title: "Premium is a plan, not a price",
    body: "Sightlines before seats, a walkout route that puts the fighters through the crowd, and a VIP end of the room that is actually a better place to watch a fight from — not the same view with a different wristband.",
    icon: "workspace_premium",
  },
];

type Figure = { value: string; label: string };

/**
 * KOMBA 1.0, in four numbers. All four are already in the repo:
 *
 * - the count in the room and the titles at stake are `content/show.ts`, which
 *   the hero and the flythrough both render;
 * - nineteen fighters is `content/fighters.ts`, which says nineteen fought and
 *   twelve are shown;
 * - five countries is the v1 site's own copy in `content/legacy-data.ts` —
 *   Denmark, Finland, Sweden, Turkey and Morocco.
 */
const figures: Figure[] = [
  { value: "1,500", label: "In the room at K.B. Hallen" },
  { value: "3", label: "Titles on the line — one world, two European" },
  { value: "19", label: "Fighters on the card" },
  { value: "5", label: "Countries represented" },
];

export function Experience() {
  return (
    <>
      <Section spacing="lg">
        {/* Ranged right from md. items-end sets the boxes against the right
            edge; text-right is what squares the lines inside them, or the
            heading would ragged-right inside a block that had merely been
            moved across. The home page's format grid makes the same turn the
            same way. */}
        <div className="flex flex-col md:items-end md:text-right">
          <Kicker>The experience</Kicker>

          <LineRise
            as="h2"
            text="A fight card, produced like a show."
            className="display-2 mt-6 max-w-[18ch] md:mt-8"
          />

          <p className="text-ink-200 mt-6 max-w-[54ch] text-base leading-[1.5] md:mt-8">
            Half of a KOMBA night is not a fight. The walkouts are staged, the
            room is lit, the break has an act in it, and a control room is
            cutting all of it live. None of that is on top of the card — it is
            what turns fifteen bouts into one evening with a shape.
          </p>
        </div>

        {/* Twelve columns from lg so the 7/5 mirror is possible; two equal
            columns at md, where a 5-column cell is 219px and stops being a
            photograph; stacked below that. */}
        <StaggerReveal className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-12">
          {frames.map((frame) => (
            <div
              key={frame.src}
              className={`bg-panel relative aspect-[4/3] overflow-hidden lg:aspect-[3/2] ${frame.span}`}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes={frame.sizes}
                className={`object-cover ${frame.position ?? ""}`}
              />
            </div>
          ))}
        </StaggerReveal>
      </Section>

      <Section spacing="lg" className="pt-0 md:pt-0">
        <Kicker as="h3">What that means on the night</Kicker>

        {/* Two columns from lg. Four rows in one column is a long scroll of
            short paragraphs; two by two puts them on one screen, which is what
            a specification wants — it is compared, not read through. */}
        <StaggerReveal className="mt-8 grid gap-x-12 gap-y-0 md:mt-10 lg:grid-cols-2 xl:gap-x-20">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="border-rule flex flex-col border-t py-6 md:py-8"
            >
              <Icon name={pillar.icon} violet className="size-8" />

              <h4 className="plain-5 mt-5 text-white">{pillar.title}</h4>

              <p className="text-ink-200 mt-3 max-w-[52ch] text-base leading-[1.5]">
                {pillar.body}
              </p>
            </article>
          ))}
        </StaggerReveal>
      </Section>

      {/* The numbers, on the frame — the same device the founder's milestones
          use, and deliberately: two strips of facts on one page should be one
          object seen twice. */}
      <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
        <div className="px-0 py-10 md:py-12">
          <p className="text-ink-300 font-body text-sm tracking-[0.06em] uppercase">
            Measured on KOMBA 1.0 — K.B. Hallen, October 2025
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label} className="flex flex-col">
                {/* display, not plain, and the one place on this page a number
                    is announced rather than read: four figures across a strip
                    is the closest the About page has to a scoreboard, and the
                    poster face is what makes it one. */}
                <dt className="display-3 text-white">{figure.value}</dt>
                <dd className="text-ink-200 mt-3 max-w-[24ch] text-sm leading-[1.4]">
                  {figure.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </SectionFrame>
    </>
  );
}
