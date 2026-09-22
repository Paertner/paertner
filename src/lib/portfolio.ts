import catalog from "./portfolio-projects.json";

export const portfolioCatalog = catalog;
export const projectPresentation = (slug: string) => catalog.find((entry) => entry.project.slug === slug);

// Existing CMS project records can still contain the previous discipline name.
export const projectServiceLabel = (label: string) => label.replace(/\b(?:web|solution) development\b/gi, "Solutions Development");

export function projectCategories(services: { label: string }[]) {
  const labels = services.map((service) => service.label).join(" ");
  const categories: string[] = [];
  if (/web design|development|website/i.test(labels)) categories.push("Solutions Development");
  if (/ui\/ux|product design|interface/i.test(labels)) categories.push("UI/UX design");
  if (/brand identity|event design|illustration|campaign design|art direction/i.test(labels)) categories.push("Brand & graphic design");
  if (/social|paid|campaign/i.test(labels)) categories.push("Social & campaigns");
  if (/seo|search|competitive intelligence/i.test(labels)) categories.push("SEO & analysis");
  return categories.length ? categories : ["Solutions Development"];
}
