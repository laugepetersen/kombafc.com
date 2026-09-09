"use client";

import { useActionState, useState } from "react";

import { SectionFrame } from "@/components/layout/section-frame";
import { Section } from "@/components/layout/section";
import { AmbientImages } from "@/components/ui/ambient-images";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { type ApplyState, submitFightApplication } from "@/app/actions";
import { type Field, steps } from "@/content/fight-apply";
import { cn } from "@/lib/utils";

/**
 * The ambience beside the form. Stills from the night rather than portraits:
 * a page asking somebody to put themselves forward should show the room they
 * would be fighting in, not the people already in it.
 */
const AMBIENCE = [3, 7, 11, 19, 24, 28].map((n) => ({
  src: `/show/show-${String(n).padStart(2, "0")}.webp`,
}));

/** The field's own box, shared by every type so they cannot drift apart. */
const CONTROL =
  "border-rule placeholder:text-ink-300 font-body w-full border bg-white/5 px-4 text-base text-white outline-none transition-colors duration-200 focus:border-white/40 disabled:opacity-60 max-md:text-[16px]";

function Control({ field, invalid }: { field: Field; invalid: boolean }) {
  const shared = {
    id: field.name,
    name: field.name,
    required: field.required,
    "aria-invalid": invalid || undefined,
    className: cn(CONTROL, invalid && "border-destructive"),
  };

  if (field.type === "textarea") {
    return (
      <textarea
        {...shared}
        rows={4}
        placeholder={field.placeholder}
        className={cn(shared.className, "resize-y py-3 leading-[1.5]")}
      />
    );
  }

  if (field.type === "select") {
    return (
      /* The browser's own picker. A two-hundred-entry list is exactly what a
         native select is for — it gets type-ahead, a scroll position, and on a
         phone the wheel — and every custom one gives those up to win a border
         radius. The arrow is ours because `appearance-none` takes theirs. */
      <div className="relative">
        <select
          {...shared}
          defaultValue=""
          className={cn(shared.className, "h-11 appearance-none pr-11")}
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((option) => (
            <option
              key={option.label}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="keyboard_arrow_down"
          aria-hidden="true"
          className="text-ink-200 pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2"
        />
      </div>
    );
  }

  return (
    <input
      {...shared}
      type={field.type}
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      inputMode={field.type === "number" ? "numeric" : undefined}
      autoComplete={
        field.name === "email"
          ? "email"
          : field.name === "phone"
            ? "tel"
            : field.name === "fullName"
              ? "name"
              : "off"
      }
      className={cn(shared.className, "h-11")}
    />
  );
}

/**
 * The application, one step at a time.
 *
 * Every step is mounted for the whole run and the ones not being answered are
 * `hidden`. That is what makes it one `<form>` rather than four: the answers
 * are in the DOM the whole time, so going back does not lose them, the submit
 * carries everything without a store to keep it in, and a browser's own
 * autofill sees the whole thing at once. `hidden` also takes a field out of
 * the tab order and out of the accessibility tree, so a reader on step two is
 * not walking through step four's boxes.
 *
 * Validation is the browser's, asked for a step at a time. `checkValidity` on
 * each field in the current step is what `required`, `type="email"` and the
 * number bounds already promise — running it here means Next lands on the box
 * that is wrong rather than the server answering "something is missing".
 */
export function FightApply() {
  const [state, action, pending] = useActionState<ApplyState, FormData>(
    submitFightApplication,
    { status: "idle" },
  );
  const [step, setStep] = useState(0);
  const [invalid, setInvalid] = useState<string[]>([]);

  const last = step === steps.length - 1;
  const current = steps[step];
  const done = state.status === "ok";

  /** Everything in this step that the browser is unhappy with. */
  const check = (form: HTMLFormElement) => {
    const bad = current.fields
      .map((field) => ({
        field,
        el: form.elements.namedItem(field.name) as
          (HTMLElement & { checkValidity(): boolean }) | null,
      }))
      .filter(({ el }) => el && !el.checkValidity())
      .map(({ field }) => field.name);

    setInvalid(bad);
    return bad;
  };

  return (
    <div className="flex flex-col">
      {/* The rail. Steps rather than a bar: four is few enough to name, and a
          reader deciding whether to start wants to know what is being asked
          before they are asked it. */}
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {steps.map((s, i) => (
          <li
            key={s.title}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "font-body text-sm transition-colors duration-200",
              i === step
                ? "text-chrome-violet brightness-125"
                : i < step
                  ? "text-white/60"
                  : "text-white/30",
            )}
          >
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>

      {done ? (
        <div className="mt-8">
          <p className="font-body flex items-center gap-2 text-base text-white">
            <Icon name="mark_email_read" violet className="size-5" />
            That is with us.
          </p>
          <p className="text-ink-200 mt-3 max-w-96 text-base leading-[1.4]">
            Somebody reads every one of these. If it is a fit for a card you
            hear from us directly — and if it is not yet, we keep it.
          </p>
        </div>
      ) : (
        <form
          action={action}
          noValidate
          onSubmit={(event) => {
            const form = event.currentTarget;
            if (check(form).length > 0) {
              event.preventDefault();
              form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
            }
          }}
          className="mt-8"
        >
          <h2 className="display-5">{current.title}</h2>
          <p className="text-ink-200 mt-2 max-w-96 text-base leading-[1.4]">
            {current.blurb}
          </p>

          {steps.map((s, i) => (
            <div
              key={s.title}
              hidden={i !== step}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              {s.fields.map((field) => (
                <div
                  key={field.name}
                  className={cn(
                    "flex flex-col",
                    !field.half && "sm:col-span-2",
                  )}
                >
                  <label
                    htmlFor={field.name}
                    className="font-body mb-2 text-sm text-white/70"
                  >
                    {field.label}
                    {field.required ? null : (
                      <span className="text-white/35"> (optional)</span>
                    )}
                  </label>

                  <Control
                    field={field}
                    invalid={i === step && invalid.includes(field.name)}
                  />

                  {field.hint ? (
                    <p className="text-ink-300 mt-2 text-sm leading-[1.4]">
                      {field.hint}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ))}

          {/* Invisible to people and to assistive tech, and out of the tab
              order — the same honeypot every other form on the site carries. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline-white"
                onClick={() => {
                  setInvalid([]);
                  setStep((s) => s - 1);
                }}
              >
                Back
              </Button>
            ) : null}

            {last ? (
              <Button type="submit" disabled={pending}>
                {pending ? "Sending" : "Send application"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(event) => {
                  const form = event.currentTarget.form;
                  if (!form) return;
                  if (check(form).length > 0) {
                    form
                      .querySelector<HTMLElement>("[aria-invalid='true']")
                      ?.focus();
                    return;
                  }
                  setInvalid([]);
                  setStep((s) => s + 1);
                }}
              >
                Continue
              </Button>
            )}
          </div>

          <p
            role="status"
            aria-live="polite"
            className={cn(
              "text-destructive text-sm",
              (state.status === "error" || invalid.length > 0) && "mt-4",
            )}
          >
            {state.status === "error"
              ? state.message
              : invalid.length > 0
                ? "Check the boxes marked before you go on."
                : ""}
          </p>
        </form>
      )}
    </div>
  );
}

export function FightApplyPage() {
  return (
    <>
      {/* The hero, on the page's own ground rather than over a photograph —
          the photographs are the column below, and two of them stacked would
          be the same page twice. Clearance at the top for the floating bar. */}
      <Section spacing="lg" className="pt-32 md:pt-40">
        <div className="flex flex-col items-start">
          <Kicker>Open call</Kicker>
          <LineRise
            as="h1"
            text="Do you have what it takes?"
            className="display-1 mt-6 max-w-[16ch] md:mt-8"
          />
          <p className="text-ink-200 mt-6 max-w-lg text-base leading-[1.4] md:mt-8">
            KOMBA is built on strikers who came from somewhere else. Every
            striking sport, one ring, one format. Tell us who you are and we
            will watch.
          </p>
        </div>
      </Section>

      {/* The split. Photographs left, the questions right — the same two-column
          block the home page and the partner tiers are built on, so a form
          does not arrive as a different kind of page. */}
      <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
        <div className="grid lg:grid-cols-2">
          <AmbientImages
            images={AMBIENCE}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-square max-lg:order-first lg:aspect-auto lg:min-h-150"
          />

          <div className="border-rule bg-panel border-t px-6 py-12 md:px-12 md:py-16 lg:border-t-0 lg:border-l lg:px-12 xl:px-15 xl:py-20">
            <FightApply />
          </div>
        </div>
      </SectionFrame>
    </>
  );
}
