import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { cache } from "react";
import type { Site, Project, Service } from "./content";
import { projectPresentation, projectServiceLabel } from "./portfolio";
export const cms = cache(() => getPayload({ config }));
export const getSite = cache(async () => {
  const data = await (await cms()).findGlobal({ slug: "site" });
  return {
    ...data,
    nav: data.nav || [],
    faqs: data.faqs || [],
    methodSteps: data.methodSteps || [],
    principles: data.principles || [],
  } as unknown as Site;
});
export const getProjects = cache(async () => {
  const r = await (
    await cms()
  ).find({
    collection: "projects",
    where: { _status: { equals: "published" } },
    sort: "order",
    limit: 100,
    depth: 1,
    overrideAccess: false,
  });
  return r.docs.map((doc) => {
    const project = { ...doc, services: doc.services?.map(service => ({ ...service, label: projectServiceLabel(service.label) })) || [] };
    const entry = projectPresentation(doc.slug);
    if (!entry) return project;
    return {
      ...project,
      image: doc.image || { id: -doc.id, url: entry.cover, alt: doc.title + " — selected project work" },
      screens: doc.screens?.length ? doc.screens : entry.gallery.map((screen, index) => ({
        image: { id: -(index + 1), url: screen.src, alt: screen.alt },
        caption: screen.caption,
      })),
    };
  }) as unknown as Project[];
});
export const getServices = cache(async () => {
  const r = await (
    await cms()
  ).find({
    collection: "services",
    sort: "number",
    limit: 100,
    depth: 1,
    overrideAccess: false,
  });
  return r.docs as unknown as (Omit<Service, "deliverables"> & {
    deliverables: { label: string }[];
  })[];
});
export const asset = (item: { image?: { url?: string } | null; art?: string; slug?: string }) => {
  return item.image?.url || (item.slug === "business-analysis" ? "/images/service-business-analysis.svg" : "");
};

export const getPage = cache(async (slug: string) => {
  const r = await (
    await cms()
  ).find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1 });
  return r.docs[0] as unknown as
    | {
        title: string;
        intro: string;
        seoTitle?: string;
        seoDescription?: string;
        image?: import("./content").Media | null;
        seoImage?: import("./content").Media | null;
        canonicalURL?: string;
        noIndex?: boolean;
      }
    | undefined;
});

export const getPosts = cache(async () => {
  const result = await (await cms()).find({ collection: "posts", where: { _status: { equals: "published" } }, sort: "-publishedAt", limit: 100, depth: 1, overrideAccess: false });
  return result.docs;
});
export const getPost = cache(async (slug: string) => {
  const result = await (await cms()).find({ collection: "posts", where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] }, limit: 1, depth: 1, overrideAccess: false });
  return result.docs[0];
});
