import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { OG_COLORS, OG_SIZE, ogFonts } from "@/lib/ogTheme";
import { SITE_URL } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A Zox blog post";

export async function generateStaticParams() {
  return (await listPosts()).map((post) => ({ slug: post.slug }));
}
/** Only posts this build shows have an image; drafts and unknown slugs are a 404. */
export const dynamicParams = false;

/**
 * A post's social preview: its title in Fraunces on paper, the date and the
 * Zox name below a hairline. Built once per post at build time.
 */
export default async function PostImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const title = post.title;
  const date = formatDate(`${post.date}T12:00:00Z`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: OG_COLORS.paper,
          color: OG_COLORS.ink,
          fontFamily: "DM Sans",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 500, color: OG_COLORS.accentStrong }}>Zox blog</div>
        <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 600, fontSize: title.length > 60 ? 60 : 72, lineHeight: 1.1 }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${OG_COLORS.line}`,
            paddingTop: 28,
            fontSize: 26,
            color: OG_COLORS.ink2,
          }}
        >
          <span>{date}</span>
          <span>{new URL(SITE_URL).host}</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
