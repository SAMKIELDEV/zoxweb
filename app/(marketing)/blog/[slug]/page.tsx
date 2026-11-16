import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/marketing/Prose";
import { container, headingTracking } from "@/components/marketing/Section";
import { textLinkClass } from "@/components/ui/TextLink";
import { getPost, listPosts } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { OPERATOR } from "@/lib/contact";
import { formatDate } from "@/lib/format";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/** Every post this build shows is built ahead of time; any other slug is a 404. */
export async function generateStaticParams() {
  return (await listPosts()).map((post) => ({ slug: post.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  // With no cover, the social image is this post's generated opengraph-image.
  const images = post.cover ? [{ url: post.cover, alt: post.title }] : undefined;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title: `${post.title} | ${SITE_NAME}`, description: post.description, ...(images ? { images } : {}) },
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

const day = (iso: string) => formatDate(`${iso}T12:00:00Z`);

/** One blog post: MDX rendered on the server through Prose, with Article structured data. */
export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  // blockJS (on by default) strips JavaScript expressions from the MDX, so a
  // post is text and markup only. Notes for authors are MDX comments
  // ({/* ... */}), which never render.
  const { content } = await compileMDX({ source: post.body });

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    mainEntityOfPage: url,
    url,
    // The generated image's address carries a build hash, so it is named only through the page metadata.
    ...(post.cover ? { image: new URL(post.cover, SITE_URL).href } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    author: { "@type": "Organization", name: "SAMKIEL Studio" },
    publisher: { "@type": "Organization", name: OPERATOR.name },
  };

  return (
    <article className={cn(container, "py-12 md:py-16")}>
      <script
        type="application/ld+json"
        // "<" is escaped so no field can close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="mb-10 max-w-[68ch]">
        <p className="mb-4 text-sm">
          <Link href="/blog" className={cn(textLinkClass, "inline-flex min-h-11 items-center md:min-h-0")}>
            Blog
          </Link>
        </p>
        <h1 className={cn("font-display text-title font-semibold text-ink", headingTracking)}>{post.title}</h1>
        <p className="mt-3 text-sm text-ink-2">
          <time dateTime={post.date}>{day(post.date)}</time>
          {post.updated ? (
            <>
              <span aria-hidden="true"> · </span>Updated <time dateTime={post.updated}>{day(post.updated)}</time>
            </>
          ) : null}
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
          {post.draft ? <span className="ml-2 font-medium text-ink">Draft, not published</span> : null}
        </p>
      </header>

      <Prose>{content}</Prose>
    </article>
  );
}
