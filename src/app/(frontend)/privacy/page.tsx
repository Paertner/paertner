import { getSite } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui";
export const generateMetadata = () =>
  meta(
    "Privacy",
    "How information is handled on the Paertner website.",
    "/privacy",
  );
export default async function Privacy() {
  const s = await getSite();
  return (
    <main id="main">
      <section className="page-hero wrap">
        <Breadcrumb items={[{ label: "Privacy" }]} />
        <h1>Privacy.</h1>
      </section>
      <article className="legal wrap">
        {!s.allowIndexing && (
          <div className="draft">
            Preview policy. Final details will be completed before public
            launch.
          </div>
        )}
        <p>{s.privacy}</p>
      </article>
    </main>
  );
}
