import { getSite } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui";
export const generateMetadata = () =>
  meta("Terms", "Terms for the Paertner website.", "/terms");
export default async function Terms() {
  const s = await getSite();
  return (
    <main id="main">
      <section className="page-hero wrap">
        <Breadcrumb items={[{ label: "Terms" }]} />
        <h1>Terms.</h1>
      </section>
      <article className="legal wrap">
        {!s.allowIndexing && (
          <div className="draft">
            Draft terms for the project preview. Review required before public
            launch.
          </div>
        )}
        <p>{s.terms}</p>
      </article>
    </main>
  );
}
