import { countries } from "@/content/countries";

/**
 * The fighter application, as data.
 *
 * The form is generic and this is what it renders — labels, order, which boxes
 * are required and which are not — so the copy can be rewritten without going
 * near the component.
 *
 * The questions are Lauge's, off the form KOMBA was already running by hand.
 */

export type FieldType =
  "text" | "email" | "tel" | "url" | "number" | "select" | "textarea";

export type Option = { value: string; label: string; disabled?: boolean };

export type Field = {
  /** Also the key it arrives under. */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** `select` only. */
  options?: Option[];
  /** Half a row from sm, where two short answers sit better side by side. */
  half?: boolean;
  /** Under the box, for anything the label cannot say in three words. */
  hint?: string;
  /** Bounds on a `number`, so the browser's own keypad and stepper agree. */
  min?: number;
  max?: number;
};

export type Step = {
  /** The eyebrow, and what the rail calls it. */
  title: string;
  /** One line under the step's heading. */
  blurb: string;
  fields: Field[];
};

/**
 * The divisions the roster is actually billed at, taken from content/fighters
 * rather than from a governing body's full ladder — a promotion should ask in
 * the language it announces in. Heaviest first, which is how a card is read.
 */
const DIVISIONS = [
  "Heavyweight",
  "Light heavyweight",
  "Super middleweight",
  "Middleweight",
  "Welterweight",
  "Super lightweight",
  "Lightweight",
  "Super featherweight",
  "Featherweight",
  "Not sure",
];

const plain = (values: string[]): Option[] =>
  values.map((value) => ({ value, label: value }));

/**
 * The nationality picker. The common answers, a rule, then the world — see the
 * note in content/countries. The divider is `disabled`, so a keyboard walking
 * the list skips it and a pointer cannot land on it.
 */
const NATIONALITIES: Option[] = [
  ...countries.slice(0, 13).map((c) => ({ value: c.name, label: c.name })),
  { value: "", label: "──────────", disabled: true },
  ...countries.slice(13).map((c) => ({ value: c.name, label: c.name })),
];

export const steps: Step[] = [
  {
    title: "You",
    blurb: "The person, before the record.",
    fields: [
      {
        name: "fullName",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        name: "fighterName",
        label: "Nickname / fighter name",
        type: "text",
        hint: "What the announcer would say.",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "your@email.com",
        half: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        required: true,
        placeholder: "+45 00 00 00 00",
        half: true,
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        required: true,
        min: 16,
        max: 60,
        half: true,
      },
      {
        name: "nationality",
        label: "Nationality",
        type: "select",
        required: true,
        options: NATIONALITIES,
        half: true,
      },
    ],
  },
  {
    title: "The fight",
    blurb: "Where you would be billed, and who you train with.",
    fields: [
      {
        name: "division",
        label: "Weight division",
        type: "select",
        required: true,
        options: plain(DIVISIONS),
        half: true,
      },
      {
        name: "height",
        label: "Height (cm)",
        type: "number",
        min: 120,
        max: 250,
        half: true,
      },
      { name: "gym", label: "Gym / club", type: "text", required: true },
      {
        name: "instagram",
        label: "Instagram",
        type: "text",
        placeholder: "@handle",
        hint: "Or a link. It is usually where the footage is.",
      },
    ],
  },
  {
    title: "The record",
    blurb: "Only what you have. An empty box is not held against anyone.",
    fields: [
      {
        name: "record",
        label: "Record (pro only)",
        type: "text",
        placeholder: "12-3-1",
        hint: "Wins-losses-draws.",
        half: true,
      },
      {
        name: "currentTitles",
        label: "Current titles",
        type: "text",
        half: true,
      },
      {
        name: "achievements",
        label: "Previous achievements / titles",
        type: "textarea",
        placeholder: "Amateur honours, national teams, anything worth knowing.",
      },
    ],
  },
  {
    title: "Who to call",
    blurb:
      "Optional, and only if it is not you. A manager, a coach, whoever handles the fights.",
    fields: [
      {
        name: "contactName",
        label: "Contact name",
        type: "text",
        half: true,
      },
      {
        name: "contactRole",
        label: "Their role",
        type: "text",
        placeholder: "Manager, coach, gym owner",
        half: true,
      },
      {
        name: "contactEmail",
        label: "Their email",
        type: "email",
        half: true,
      },
      {
        name: "contactPhone",
        label: "Their phone",
        type: "tel",
        half: true,
      },
    ],
  },
];
