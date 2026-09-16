import { getSite } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, SceneImage, Closing } from "@/components/ui";
export const generateMetadata = () =>
  meta(
    "Studio",
    "Meet Paertner, a US-based digital agency built around the connection between strategic marketing and considered digital craft.",
    "/studio",
  );
export default async function Studio() {
  const site = await getSite();
  return (
    <main id="main">
      <section className="page-hero wrap">
        <Breadcrumb items={[{ label: "Studio" }]} />
        <h1>{site.studioTitle}</h1>
        <div className="page-intro">
          <p>A creative digital agency. A shared way forward.</p>
          <span className="meta">
            Based in the US
            <br />
            Connected by curiosity
          </span>
        </div>
      </section>
      <div className="studio-image">
        <SceneImage
          src={site.studioImage?.url || ""}
          alt="Paertner website design, responsive layout and search preview"
          priority
        />
      </div>
      <section className="studio-manifesto wrap">
        <span className="section-label">The way we see it</span>
        <p>{site.studioBody}</p>
      </section>
      <section className="principles wrap" aria-label="Our principles">
        {site.principles.map((v, i) => (
          <article key={v.title}>
            <span>0{i + 1}</span>
            <div>
              <h2>{v.title}</h2>
              <p>{v.body}</p>
            </div>
          </article>
        ))}
      </section>
      <Closing site={site} />
    </main>
  );
}
