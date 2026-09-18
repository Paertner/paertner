import type { CSSProperties } from "react";
import ScrollSpark from "@/components/ScrollSpark";
import { getProjects, getServices, getSite } from "@/lib/cms";
import { meta, origin } from "@/lib/seo";
import { ProjectTile, LinkArrow, Closing } from "@/components/ui";
import { Entrance, Discovery, Campaigns, Capabilities } from "@/components/HomeScenes";
export const generateMetadata = () =>
  meta(
    "Marketing meets making",
    "Paertner connects digital marketing, websites, and web applications to open what is next for your business.",
  );
export default async function Home() {
  const [site, projects, services] = await Promise.all([
    getSite(),
    getProjects(),
    getServices(),
  ]);
  return (
    <main id="main" className="digital-home" style={{ "--intro-image": site.heroPoster?.url ? `url(${JSON.stringify(site.heroPoster.url)})` : "none" } as CSSProperties}>
      <Entrance site={site} />
      <ScrollSpark />
      <section className="intro wrap" data-sc-act="flow">
        <div className="intro-aside">
          <span className="section-label">The Paertner perspective</span>
          <img src="/identity/mark.svg" alt="" width="100" height="64" />
        </div>
        <div>
          <h2 data-sc-cue="0.1 0.99 0.16 0" data-sc-kinetic="lines">{site.introTitle}</h2>
          <p className="large-body">{site.introBody}</p>
        </div>
      </section>
      {services.find(s => s.slug === "seo") && <Discovery service={services.find(s => s.slug === "seo")!} />}
      <Campaigns services={services} />
      <Capabilities services={services} />
      <section className="work-section wrap" data-sc-act="flow">
        <div className="work-heading">
          <div>
            <span className="section-label">Selected work</span>
            <h2>{site.workTitle}</h2>
          </div>
          <p>{site.workDescription}</p>
        </div>
        <div className="home-projects">
          {projects
            .filter((p) => p.featured)
            .slice(0, 3)
            .map((p, i) => (
              <ProjectTile key={p.id} project={p} index={i} />
            ))}
        </div>
        <LinkArrow href="/work">View all work</LinkArrow>
      </section>
      <section className="method wrap" data-sc-act="flow">
        <div>
          <span className="section-label">How we get there</span>
          <h2>{site.methodTitle}</h2>
          <LinkArrow href="/studio">Inside Paertner</LinkArrow>
        </div>
        <div className="method-steps" data-sc-in>
          {site.methodSteps.map((s, i) => (
            <article key={s.title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Closing site={site} sparkMark />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Paertner",
            url: origin,
            description: site.heroDescription,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
