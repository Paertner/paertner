import { getServices, getSite, getPage, asset } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, SceneImage, LinkArrow, Closing } from "@/components/ui";
export const generateMetadata = () =>
  meta(
    "Services",
    "Business analysis, digital marketing, websites, web apps, SEO, social media, paid advertising, and brand content from Paertner.",
    "/services",
  );
export default async function Services() {
  const [services, site, page] = await Promise.all([getServices(), getSite(), getPage("services")]);
  return (
    <main id="main">
      <section className="page-hero wrap">
        <Breadcrumb items={[{ label: "Services" }]} />
        <h1>{page?.title || "One partner. More possibility."}</h1>
        <div className="page-intro">
          <p>{page?.intro}</p>
          <LinkArrow href="/book">Find your starting point</LinkArrow>
        </div>
      </section>
      <section className="service-index wrap" aria-label="Our services">
        {services.map((s) => (
          <article className="service-feature" key={s.id}>
            <div className="service-feature-copy">
              <span className="section-label">
                {s.number} / {s.title}
              </span>
              <h2>{s.short}</h2>
              <p>{s.intro}</p>
              <ul className="service-preview-deliverables">{s.deliverables.slice(0, 3).map(d => <li key={d.label}>{d.label}</li>)}</ul>
              <LinkArrow href={"/services/" + s.slug}>
                Explore {s.title.toLowerCase()}
              </LinkArrow>
            </div>
            <a
              href={"/services/" + s.slug}
              className="service-feature-media"
              aria-label={s.title}
            >
              <SceneImage
                src={asset(s)}
                alt={s.image?.alt || ""}
                sizes="(max-width: 640px) 100vw, 55vw"
              />
            </a>
          </article>
        ))}
      </section>
      <Closing site={site} />
    </main>
  );
}
