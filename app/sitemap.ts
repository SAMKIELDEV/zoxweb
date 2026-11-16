import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

/** The public pages. The dashboard and sign-in are private and left out (see robots.ts). */
const PAGES = ["/", "/pricing", "/guide", "/blog", "/contact", "/terms", "/privacy", "/refunds", "/acceptable-use"] as const;

/** Built at build time: the public pages plus every published blog post (drafts never appear). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts();
  return [
    ...PAGES.map((page) => ({ url: `${SITE_URL}${page === "/" ? "" : page}` })),
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updated ?? post.date })),
  ];
}
