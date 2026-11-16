import type { Metadata } from "next";
import Link from "next/link";
import { container, headingTracking } from "@/components/marketing/Section";
import { ButtonLink } from "@/components/ui/Button";
import { textLinkClass } from "@/components/ui/TextLink";
import { listPosts } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { OPEN_GRAPH_IMAGE, SITE_NAME, START_CHAT, TWITTER_IMAGE } from "@/lib/site";

const title = "Blog";
const description = "News and notes from the people building Zox.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog", types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Zox blog" }] } },
  openGraph: { type: "website", url: "/blog", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** "Nov 12, 2026", read as a calendar date so no time zone moves it a day. */
const day = (iso: string) => formatDate(`${iso}T12:00:00Z`);

/**
 * The blog index. Built once from content/blog: posts are read when the site
 * is built, so there is nothing to load and nothing that can fail at view
 * time. A post with broken front matter fails the build instead.
 */
export default async function BlogIndex() {
  const posts = await listPosts();

  return (
    <div className={cn(container, "py-12 md:py-16")}>
      <header className="mb-10 max-w-[68ch]">
        <h1 className={cn("font-display text-title font-semibold text-ink", headingTracking)}>{title}</h1>
        <p className="mt-3 text-base text-ink-2">{description}</p>
      </header>

      {posts.length === 0 ? (
        <div className="flex max-w-[68ch] flex-col items-start gap-4">
          <p className="text-base text-ink-2">No posts yet. Zox is busy answering messages, and the first one is on its way.</p>
          <ButtonLink href={START_CHAT.href} external={START_CHAT.external} variant="secondary">
            Chat with Zox
          </ButtonLink>
        </div>
      ) : (
        <ol role="list" className="max-w-[68ch] border-t border-line">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-line py-6">
              <article>
                <h2 className={cn("font-display text-lg font-semibold text-ink", headingTracking)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 transition-colors duration-(--dur-fast) ease-zox hover:text-accent-ink hover:underline md:min-h-0"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-ink-2">
                  <time dateTime={post.date}>{day(post.date)}</time>
                  <span aria-hidden="true"> · </span>
                  {post.readingMinutes} min read
                  {post.draft ? <span className="ml-2 font-medium text-ink">Draft, not published</span> : null}
                </p>
                <p className="mt-3 text-base text-ink">{post.description}</p>
              </article>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-10 text-sm text-ink-2">
        Follow along with the{" "}
        <a href="/blog/rss.xml" className={textLinkClass}>
          RSS feed
        </a>
        .
      </p>
    </div>
  );
}
