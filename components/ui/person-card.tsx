import Image from "next/image";

import { cn } from "@/lib/utils";

export type Person = {
  id: string;
  name: string;
  role: string;
  /** Falls back to initials while a portrait is still missing. */
  imageSrc?: string;
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

/**
 * Name-and-role chip. Glass over whatever it sits on, on `--color-glass` —
 * near-neutral, so it does not read as a violet patch over video, and low
 * enough in alpha that the blur frosts the panel rather than lighting it up.
 * Sized by its content: the avatar sets the height, the name sets the width.
 */
export function PersonCard({
  person,
  className,
}: {
  person: Person;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-glass-edge bg-glass/8 flex items-center gap-3 rounded-lg border p-1 pr-4 backdrop-blur-lg",
        className,
      )}
    >
      {/* Fades rather than unmounts, so a card coming forward brings its
          content up as it grows instead of snapping it on. */}
      <div className="flex items-center gap-3 transition-opacity duration-300 ease-out [[data-behind]_&]:opacity-0">
        <div className="bg-ink-800 relative size-15 shrink-0 overflow-hidden rounded-sm">
          {person.imageSrc ? (
            <Image
              src={person.imageSrc}
              // The name is right beside it as text; describing the portrait
              // here would only have it announced twice.
              alt=""
              fill
              sizes="60px"
              className="object-cover object-top"
            />
          ) : (
            <span className="text-ink-300 font-heading grid size-full place-items-center text-lg font-bold">
              {initialsOf(person.name)}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-heading text-base leading-tight font-bold text-white">
            {person.name}
          </span>
          <span className="text-ink-200 text-sm leading-tight tracking-[0.02em]">
            {person.role}
          </span>
        </div>
      </div>
    </div>
  );
}
