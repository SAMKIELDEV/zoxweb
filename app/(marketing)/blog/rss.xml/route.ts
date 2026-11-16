import { listPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

/** Built once, at build time, from the same posts the index shows. */
export const dynamic = "force-static";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** RFC 822 date, as RSS wants, for a calendar date. */
const rssDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

export async function GET() {
  const posts = await listPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const categories = post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n");
      return [
        "    <item>",
        `      <title>${escape(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rssDate(post.date)}</pubDate>`,
        `      <description>${escape(post.description)}</description>`,
        ...(categories ? [categories] : []),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zox blog</title>
    <link>${SITE_URL}/blog</link>
    <description>News and notes from the people building Zox.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${rssDate(posts[0].updated ?? posts[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
