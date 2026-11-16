import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Public pages are open to search engines; the signed-in dashboard, sign-in and the API are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/login", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
