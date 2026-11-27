import type { IconType } from "react-icons";
import { LuAward, LuBriefcase, LuGraduationCap, LuZap } from "react-icons/lu";

export type CategoryId = "job" | "internship" | "task" | "grants";

export interface CategoryDef {
  id: CategoryId;
  /** Child route under /home */
  path: string;
  icon: IconType;
  /** Tile colour (token name) and readable text colour on top of it */
  color: string;
  onColor: string;
  fields: FieldDef[];
}

export type FieldKind = "text" | "textarea" | "number" | "date" | "url" | "select" | "choice";

export interface FieldDef {
  name: string;
  kind: FieldKind;
  required?: boolean;
  /** Option values; labels come from i18n `options.<value>` unless `rawOptions` */
  options?: string[];
  rawOptions?: boolean;
  /** Render next to the following field on one row */
  half?: boolean;
  /** i18n key override for the label (defaults to fields.<name>) */
  labelKey?: string;
  /** i18n key for helper text */
  hintKey?: string;
  placeholder?: string;
}

export const CURRENCIES = ["UZS", "KZT", "KGS", "TJS", "TMT", "AZN", "RUB", "USD", "EUR"];

const contact: FieldDef = { name: "contact", kind: "text", required: true, hintKey: "hints.contact" };
const workFormat: FieldDef = {
  name: "workFormat",
  kind: "choice",
  required: true,
  options: ["office", "remote", "hybrid"],
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: "job",
    path: "job",
    icon: LuBriefcase,
    color: "cobalt",
    onColor: "white",
    fields: [
      { name: "title", kind: "text", required: true, labelKey: "fields.position" },
      { name: "company", kind: "text", required: false },
      { name: "location", kind: "text", required: true },
      { name: "requirements", kind: "textarea", required: true },
      { name: "duties", kind: "textarea", required: false },
      { name: "workFormat", kind: "text", required: true},
      { name: "salary", kind: "text", required: true },
      contact,
      { name: "additional", kind: "textarea", hintKey: "hints.jobDescription" }
    ],
  },
  {
    id: "internship",
    path: "internship",
    icon: LuGraduationCap,
    color: "apricot",
    onColor: "plum",
    fields: [
      { name: "title", kind: "text", required: true, labelKey: "fields.position" },
      { name: "company", kind: "text", required: true },
      { name: "city", kind: "text", required: true },
      { name: "duration", kind: "text", required: true, hintKey: "hints.duration" },
      { name: "paid", kind: "choice", required: true, options: ["paid", "unpaid"] },
      workFormat,
      { name: "stipend", kind: "number", half: true },
      { name: "currency", kind: "select", options: CURRENCIES, rawOptions: true, half: true },
      { name: "description", kind: "textarea", required: true },
      { name: "requirements", kind: "textarea" },
      contact,
    ],
  },
  {
    id: "task",
    path: "one_time_task",
    icon: LuZap,
    color: "mint",
    onColor: "plum",
    fields: [
      { name: "title", kind: "text", required: true, labelKey: "fields.taskTitle" },
      { name: "budget", kind: "number", required: true, half: true },
      { name: "currency", kind: "select", options: CURRENCIES, rawOptions: true, half: true },
      { name: "deadline", kind: "date" },
      { name: "location", kind: "choice", required: true, options: ["onsite", "remote"] },
      { name: "city", kind: "text" },
      { name: "description", kind: "textarea", required: true, hintKey: "hints.taskDescription" },
      contact,
    ],
  },
  {
    id: "grants",
    path: "opportunities_grants",
    icon: LuAward,
    color: "violet",
    onColor: "white",
    fields: [
      { name: "title", kind: "text", required: true, labelKey: "fields.opportunityTitle" },
      { name: "organization", kind: "text", required: true },
      {
        name: "oppType",
        kind: "select",
        required: true,
        options: ["grant", "scholarship", "contest", "fellowship", "program"],
      },
      { name: "deadline", kind: "date", required: true },
      { name: "amount", kind: "text" },
      { name: "eligibility", kind: "textarea" },
      { name: "description", kind: "textarea", required: true },
      { name: "link", kind: "url", hintKey: "hints.link" },
      contact,
    ],
  },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
