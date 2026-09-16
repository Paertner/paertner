import { notFound, permanentRedirect } from "next/navigation";
import { getProjects, getSite, cms, asset } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, SceneImage, Closing } from "@/components/ui";
import ProjectScreens from "@/components/ProjectScreens";
import { projectPresentation } from "@/lib/portfolio";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = (await getProjects()).find((p) => p.slug === slug);
  return p
    ? meta(
        p.seoTitle || p.title,
        p.seoDescription || p.descriptor,
        "/work/" + p.slug,
        asset(p),
        p,
      )
    : meta("Project not found", "This project is not available.");
}
export default async function Project({ params }: Props) {
  const { slug } = await params;
  const [projects, site] = await Promise.all([getProjects(), getSite()]);
  const p = projects.find((p) => p.slug === slug);
  if (!p) {
    const r = await (
      await cms()
    ).find({
      collection: "redirects",
      where: { from: { equals: "/work/" + slug } },
      limit: 1,
    });
    if (r.docs[0]?.to) permanentRedirect(r.docs[0].to);
    notFound();
  }
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  const presentation = projectPresentation(p.slug);
  return (
    <main id="main">
      <section className="page-hero wrap">
        <Breadcrumb
          items={[{ label: "Work", href: "/work" }, { label: p.title }]}
        />
        <div className="case-title">
          <h1>{p.title}</h1>
          <p>{p.descriptor}</p>
        </div>
        <dl className="case-facts">
          <div>
            <dt>Discipline</dt>
            <dd>{p.services.map((s) => s.label).join(" / ")}</dd>
          </div>
          <div>
            <dt>Sector</dt>
            <dd>{p.sector}</dd>
          </div>
          {p.year && <div>
            <dt>Year</dt>
            <dd>{p.year}</dd>
          </div>}
          <div>
            <dt>Project</dt>
            <dd>{p.concept ? "Independent concept" : presentation?.projectKind || "Client work"}</dd>
          </div>
        </dl>
        {p.liveURL && (
          <a className="case-live-link" href={p.liveURL} target="_blank" rel="noreferrer">
            <span>Visit live website</span>
            <span aria-hidden>↗</span>
          </a>
        )}
        {!p.liveURL && presentation?.sourceURL && <a className="case-live-link" href={presentation.sourceURL} target="_blank" rel="noreferrer">
          <span>{presentation.sourceLabel}</span><span aria-hidden>↗</span>
        </a>}
      </section>
      <div
        className={
          "case-art case-art--photographic tone-" +
          p.tone +
          (!p.concept ? " case-art--nova" : "")
        }
      >
        <SceneImage
          src={asset(p)}
          alt={p.image?.alt || p.title + " creative direction"}
          priority
          unoptimized
        />
        <span className="project-art-title" aria-hidden>
          {p.title}
        </span>
      </div>
      <section className="case-story wrap">
        {p.concept && (
          <aside className="concept-note">
            <strong>A creative exploration</strong>This is an independent
            concept built to show our approach. It does not represent a client
            engagement or measured commercial results.
          </aside>
        )}
        {[
          ["The challenge", p.challenge],
          ["The idea", p.idea],
          ["Made connected", p.execution],
          ["The outcome", p.result],
        ].map(([title, body]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      {!!p.details?.length && (
        <section className="case-details wrap" aria-labelledby="case-details-title">
          <div className="case-details-intro">
            <span className="section-label">Inside the work</span>
            <h2 id="case-details-title">{presentation ? "Scope & collaboration." : "Designed around the visitor journey."}</h2>
          </div>
          <div className="case-details-grid">
            {p.details.map((detail, index) => (
              <article className="case-detail-card" key={detail.title}>
                <span className="case-detail-number">{String(index + 1).padStart(2, "0")}</span>
                {detail.eyebrow && <span className="case-detail-eyebrow">{detail.eyebrow}</span>}
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {!!p.screens?.length && (
        <section className="case-gallery wrap" aria-label={p.title + " project gallery"}>
          <div className="case-gallery-heading">
            <span className="section-label">{presentation ? "Selected work" : "Selected screens"}</span>
            <p>{presentation ? "Explore the details. Select an image for a closer look." : "Explore the website, screen by screen. Select an image for a closer look."}</p>
          </div>
          <ProjectScreens screens={p.screens.filter((screen) => screen.image?.url).map((screen) => ({
            src: screen.image.url || "",
            alt: screen.image.alt || "",
            caption: screen.caption || "Project detail",
          }))} />
        </section>
      )}
      {next && (
        <a href={"/work/" + next.slug} className="next-work wrap">
          <div>
            <span className="section-label">Next project</span>
            <h2>{next.title}</h2>
          </div>
          <span aria-hidden>↗</span>
        </a>
      )}
      <Closing site={site} />
    </main>
  );
}
