import type { Metadata } from "next";
import { getSite, getPage } from "./cms";
export const origin = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
type SEO = { seoTitle?: string | null; seoDescription?: string | null; seoImage?: { url?: string | null } | number | null; canonicalURL?: string | null; noIndex?: boolean | null };
export async function meta(title: string, description: string, path = "/", image = "", entry?: SEO, article?: { publishedAt?: string | null; updatedAt?: string; author?: string | null }): Promise<Metadata> {
  const pageSlug = path === "/" ? "home" : path.slice(1);
  const [site, page] = await Promise.all([getSite(), ["home", "work", "services", "studio", "book", "privacy", "terms", "blog"].includes(pageSlug) ? getPage(pageSlug) : Promise.resolve(undefined)]);
  const seo = entry || page;
  title = seo?.seoTitle || title;
  description = seo?.seoDescription || description;
  const shareImage = typeof seo?.seoImage === "object" ? seo.seoImage?.url : undefined;
  image = shareImage || image || site.socialImage?.url || "";
  const canonical = seo?.canonicalURL || path;
  return {
    title: { absolute: title + " | Paertner" }, description,
    alternates: { canonical }, robots: { index: Boolean(site.allowIndexing) && !seo?.noIndex, follow: true },
    openGraph: { title: title + " | Paertner", description, url: canonical, type: article ? "article" : "website", siteName: "Paertner", images: image ? [{ url: image }] : [], ...(article ? { publishedTime: article.publishedAt || undefined, modifiedTime: article.updatedAt, authors: article.author ? [article.author] : [] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : [] },
  };
}
