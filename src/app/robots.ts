import type { MetadataRoute } from "next";
import { getSite } from "@/lib/cms";
import { origin } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSite();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: s.allowIndexing ? ["/admin", "/api/"] : ["/admin", "/api/"],
    },
    sitemap: origin + "/sitemap.xml",
  };
}
