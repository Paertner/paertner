import { getSite } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui";
import ArticleBody from "@/components/ArticleBody";
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
        <ArticleBody body={s.privacy} />
      </article>
    </main>
  );
}
