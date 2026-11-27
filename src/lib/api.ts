/**
 * Mock data layer. Posts are stored in localStorage so the Mini App is fully
 * usable without a backend. Replace the bodies of these functions with real
 * requests (sending Telegram `initData` for auth) when the bot API is ready.
 */
import type { CategoryId } from "../data/categories";
import type { CountryCode } from "../data/countries";

export type PostStatus = "in_review" | "approved" | "rejected";

export interface Post {
  id: string;
  category: CategoryId;
  status: PostStatus;
  country: CountryCode;
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
  rejectionReason?: string;
  channelUrl?: string;
}

const KEY = "jobsland:posts:v1";
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function read(): Post[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Post[];
  } catch {
    /* storage unavailable */
  }
  const seeded = seed();
  write(seeded);
  return seeded;
}

function write(posts: Post[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(posts));
  } catch {
    /* storage unavailable — keep in memory only */
    memory = posts;
  }
}
let memory: Post[] | null = null;
const all = () => memory ?? read();

export async function listPosts(): Promise<Post[]> {
  await delay();
  return [...all()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id: string): Promise<Post | undefined> {
  await delay(200);
  return all().find((p) => p.id === id);
}

export async function createPost(input: {
  category: CategoryId;
  country: CountryCode;
  fields: Record<string, string>;
}): Promise<Post> {
  await delay(700);
  const now = new Date().toISOString();
  const post: Post = {
    id: Math.random().toString(36).slice(2, 10),
    status: "in_review",
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  write([post, ...all()]);
  return post;
}

export async function resubmitPost(id: string, fields: Record<string, string>): Promise<Post> {
  await delay(700);
  const posts = all();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("not_found");
  const updated: Post = {
    ...posts[idx],
    fields,
    status: "in_review",
    rejectionReason: undefined,
    updatedAt: new Date().toISOString(),
  };
  posts[idx] = updated;
  write(posts);
  return updated;
}

export async function deletePost(id: string): Promise<void> {
  await delay(300);
  write(all().filter((p) => p.id !== id));
}

/* ---------- demo data ---------- */

function seed(): Post[] {
  const day = 86_400_000;
  const at = (daysAgo: number) => new Date(Date.now() - daysAgo * day).toISOString();
  const rows: Array<Omit<Post, "createdAt" | "updatedAt"> & { ago: number }> = [
    { id: "a1x9k2", ago: 0.1, category: "job", status: "in_review", country: "UZ", fields: { title: "Frontend developer (React)", company: "Nova Soft", city: "Tashkent", employment: "fullTime", workFormat: "hybrid", salaryFrom: "12000000", salaryTo: "20000000", currency: "UZS", description: "Build customer-facing web apps with React and TypeScript. Five-day week, flexible start.", requirements: "2+ years with React, TypeScript, REST APIs", contact: "@novasoft_hr" } },
    { id: "b7m3q1", ago: 1, category: "internship", status: "approved", country: "UZ", channelUrl: "https://t.me/jobsland", fields: { title: "Marketing intern", company: "Bozor Market", city: "Tashkent", duration: "3 months", paid: "paid", workFormat: "office", stipend: "3000000", currency: "UZS", description: "Help the brand team with social media campaigns and market research.", contact: "+998 90 123 45 67" } },
    { id: "c2p8z4", ago: 2, category: "task", status: "rejected", country: "UZ", rejectionReason: "Add a budget amount and a clear description of the result.", fields: { title: "Logo for a coffee shop", budget: "", currency: "UZS", location: "remote", description: "Need a logo.", contact: "@coffee_nukus" } },
    { id: "d5r1w7", ago: 3, category: "grants", status: "approved", country: "UZ", channelUrl: "https://t.me/jobsland", fields: { title: "Silk Road master's scholarship", organization: "Eurasia Education Fund", oppType: "scholarship", deadline: "2027-02-15", amount: "€1,400 per month", eligibility: "Bachelor's graduates from partner countries", description: "Fully funded joint master's programmes in Europe.", link: "https://example.org/silk-road-scholarship", contact: "@eef_scholarships" } },
    { id: "e9t4y2", ago: 4, category: "job", status: "approved", country: "UZ", channelUrl: "https://t.me/jobsland", fields: { title: "Accountant", company: "Samarkand Textile", city: "Samarkand", employment: "fullTime", workFormat: "office", salaryFrom: "7000000", currency: "UZS", description: "Primary accounting, tax reports, payroll.", contact: "+998 66 210 00 00" } },
    { id: "f3u6i8", ago: 5, category: "job", status: "in_review", country: "UZ", fields: { title: "Delivery driver", company: "Tez Yetkaz", city: "Tashkent", employment: "partTime", workFormat: "office", salaryFrom: "5000000", salaryTo: "9000000", currency: "UZS", description: "Deliver orders around the city. Own car preferred.", contact: "@tezyetkaz_jobs" } },
    { id: "g1o2p3", ago: 6, category: "task", status: "approved", country: "UZ", channelUrl: "https://t.me/jobsland", fields: { title: "Translate a website from English to Uzbek", budget: "1500000", currency: "UZS", deadline: "2026-12-10", location: "remote", description: "About 4,000 words, mostly product descriptions.", contact: "@shop_admin" } },
    { id: "h8j7k6", ago: 8, category: "internship", status: "rejected", country: "UZ", rejectionReason: "The contact is missing. Add a Telegram username or phone number.", fields: { title: "Data analyst intern", company: "Silk Telecom", city: "Tashkent", duration: "6 months", paid: "paid", workFormat: "hybrid", description: "Work with SQL and dashboards in the BI team.", contact: "" } },
    { id: "i4l5m6", ago: 10, category: "job", status: "approved", country: "UZ", channelUrl: "https://t.me/jobsland", fields: { title: "English teacher", company: "Bright Path Language Centre", city: "Bukhara", employment: "partTime", workFormat: "office", salaryFrom: "6000000", currency: "UZS", description: "Evening groups, IELTS preparation.", contact: "@brightpath_bukhara" } },
    { id: "j2n3b4", ago: 12, category: "grants", status: "in_review", country: "UZ", fields: { title: "Startup grant for young founders", organization: "Tech Hub Foundation", oppType: "grant", deadline: "2027-01-20", amount: "Up to $10,000", description: "Funding and mentorship for early-stage tech startups.", link: "https://example.org/startup-grant", contact: "@techhub_grants" } },
    { id: "k6v7c8", ago: 15, category: "task", status: "in_review", country: "UZ", fields: { title: "Help moving furniture", budget: "400000", currency: "UZS", deadline: "2026-11-30", location: "onsite", city: "Tashkent", description: "Two people for three hours, third floor without a lift.", contact: "+998 93 555 12 12" } },
    { id: "l9x1z2", ago: 20, category: "job", status: "rejected", country: "UZ", rejectionReason: "Job ads that ask candidates to pay a fee are not allowed.", fields: { title: "Sales manager", company: "Global Trade", city: "Tashkent", employment: "fullTime", workFormat: "office", description: "Registration fee required before training.", contact: "@globaltrade" } },
    { id: "m3a4s5", ago: 26, category: "internship", status: "approved", country: "UZ", channelUrl: "https://t.me/jobsland", fields: { title: "Backend intern (Go)", company: "Paylink", city: "Tashkent", duration: "4 months", paid: "paid", workFormat: "office", stipend: "4000000", currency: "UZS", description: "Join the payments team and ship real features.", contact: "@paylink_careers" } },
  ];
  return rows.map(({ ago, ...p }) => ({ ...p, createdAt: at(ago), updatedAt: at(ago) }));
}
