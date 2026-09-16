import { getProjects, getSite, getPage } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, ProjectTile, Closing } from "@/components/ui";
import WorkGallery from "@/components/WorkGallery";
import { projectCategories } from "@/lib/portfolio";
export const generateMetadata = () =>
  meta(
    "Work",
    "Explore Paertner’s work in websites, product interfaces, branding, social campaigns, SEO, and business analysis.",
    "/work",
  );
export default async function Work() {
  const [projects, site, page] = await Promise.all([getProjects(), getSite(), getPage("work")]);
  return (
    <main id="main">
      <section className="page-hero wrap">
        <Breadcrumb items={[{ label: "Work" }]} />
        <h1>{page?.title || "Ideas made into worlds."}</h1>
        <div className="page-intro">
          <p>{page?.intro || site.workDescription}</p>
          <span className="meta">
            Selected work
            <br />
            Strategy, creativity & technology
          </span>
        </div>
      </section>
      <section className="wrap" aria-label="Project collection">
        <WorkGallery
          items={projects.map((p) => ({
            id: p.id,
            categories: projectCategories(p.services),
            node: <ProjectTile project={p} />,
          }))}
        />
      </section>
      <Closing site={site} />
    </main>
  );
}
