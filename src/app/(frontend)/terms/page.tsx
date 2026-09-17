import { getSite } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui";
import ArticleBody from "@/components/ArticleBody";
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
        <ArticleBody body={s.terms} />
      </article>
    </main>
  );
}
