import catalog from "./portfolio-projects.json";

export const portfolioCatalog = catalog;
export const projectPresentation = (slug: string) => catalog.find((entry) => entry.project.slug === slug);

export function projectCategories(services: { label: string }[]) {
  const labels = services.map((service) => service.label).join(" ");
  const categories: string[] = [];
  if (/web design|web development|development|website/i.test(labels)) categories.push("Web development");
  if (/ui\/ux|product design|interface/i.test(labels)) categories.push("UI/UX design");
  if (/brand identity|event design|illustration|campaign design|art direction/i.test(labels)) categories.push("Brand & graphic design");
  if (/social|paid|campaign/i.test(labels)) categories.push("Social & campaigns");
  if (/seo|search|competitive intelligence/i.test(labels)) categories.push("SEO & analysis");
  return categories.length ? categories : ["Web development"];
}
