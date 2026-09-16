import { getProjects, getSite, getPage } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, ProjectTile, Closing } from "@/components/ui";
import WorkGallery from "@/components/WorkGallery";
export const generateMetadata = () =>
  meta(
    "Work",
    "Explore Paertner’s client websites in digital marketing, brand strategy, web design, and development.",
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
            category: p.services.some((s) => /seo|search/i.test(s.label))
              ? "SEO"
              : p.services.some((s) => /social|paid|campaign/i.test(s.label))
                ? "Social & campaigns"
                : "Web development",
            node: <ProjectTile project={p} />,
          }))}
        />
      </section>
      <Closing site={site} />
    </main>
  );
}
