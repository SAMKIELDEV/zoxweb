import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/**
 * Blog posts: MDX files in content/blog, one per post, named <slug>.mdx.
 * Read at build time. Front matter is checked here, so a post with a
 * missing or malformed field fails the build instead of shipping broken.
 *
 * Drafts (draft: true) are left out of production builds everywhere: the
 * index, the post routes, the feed and the sitemap. `next dev` shows them,
 * marked as drafts, so they can be read before publishing.
 */

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated: string | null;
  tags: string[];
  /** A path under public/ or an https address, used as the social image. */
  cover: string | null;
  draft: boolean;
  /** Whole minutes at 200 words a minute, at least 1. */
  readingMinutes: number;
}

export interface Post extends PostMeta {
  /** The MDX body, front matter removed. */
  body: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Drafts are shown only while developing. */
export const showDrafts = process.env.NODE_ENV !== "production";

/** gray-matter reads unquoted YAML dates as Date objects; accept both shapes. */
function isoDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value !== "string" || !DATE.test(value)) return null;
  // Reject impossible dates such as 2026-13-45: they must survive a round trip.
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? value : null;
}

function readingMinutes(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parsePost(slug: string, source: string): Post {
  const { data, content } = matter(source);
  const fail = (field: string) => {
    throw new Error(`content/blog/${slug}.mdx: front matter "${field}" is missing or invalid`);
  };
  if (!SLUG.test(slug)) throw new Error(`content/blog/${slug}.mdx: file names must be lowercase words joined by hyphens`);
  if (typeof data.title !== "string" || !data.title.trim()) fail("title");
  if (typeof data.description !== "string" || !data.description.trim()) fail("description");
  const date = isoDate(data.date);
  if (!date) fail("date");
  const updated = data.updated === undefined || data.updated === null ? null : isoDate(data.updated);
  if (data.updated != null && !updated) fail("updated");
  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) fail("tags");
  const cover = data.cover ?? null;
  if (cover !== null && (typeof cover !== "string" || !(cover.startsWith("/") || cover.startsWith("https://")))) fail("cover");
  if (data.draft !== undefined && typeof data.draft !== "boolean") fail("draft");

  return {
    slug,
    title: (data.title as string).trim(),
    description: (data.description as string).trim(),
    date: date!,
    updated,
    tags: tags as string[],
    cover: cover as string | null,
    draft: data.draft === true,
    readingMinutes: readingMinutes(content),
    body: content,
  };
}

async function readAll(): Promise<Post[]> {
  let files: string[];
  try {
    files = await readdir(POSTS_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => parsePost(file.slice(0, -4), await readFile(path.join(POSTS_DIR, file), "utf8"))),
  );
  return posts.filter((post) => showDrafts || !post.draft);
}

/** Every post this build may show, newest first, without bodies. */
export async function listPosts(): Promise<PostMeta[]> {
  return (await readAll())
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    .map(({ body: _body, ...meta }) => meta);
}

/** One post with its body, or null when it does not exist or is a draft in production. */
export async function getPost(slug: string): Promise<Post | null> {
  if (!SLUG.test(slug)) return null;
  return (await readAll()).find((post) => post.slug === slug) ?? null;
}
