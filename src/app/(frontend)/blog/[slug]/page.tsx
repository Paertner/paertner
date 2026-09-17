import ArrowIcon from "@/components/ArrowIcon";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, SceneImage, LinkArrow } from "@/components/ui";
import ArticleBody, { articleSections } from "@/components/ArticleBody";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { const post = await getPost((await params).slug); if (!post) notFound(); return meta(post.title, post.excerpt, "/blog/" + post.slug, typeof post.image === "object" ? post.image?.url || "" : "", post, post); }
export default async function Article({ params }: Props) {
 const post = await getPost((await params).slug); if (!post) notFound();
 const sections = articleSections(post.body);
 const readingTime = Math.max(1, Math.ceil(post.body.split(/\s+/).length / 220));
 const contact = post.body.match(/\]\((\/book\?[^\s)\\]+)\)/)?.[1] || "/book#contact-form";
 const service = post.body.match(/\]\((\/services\/[^\s)\\]+)\)/)?.[1];
 const related = (await getPosts()).filter(item => item.id !== post.id).slice(0, 2);
 return <main id="main" className="blog-article"><article>
  <header className="page-hero wrap"><Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} /><h1>{post.title}</h1><div className="page-intro"><p>{post.excerpt}</p><span className="meta">{post.author} · {readingTime} min read<br /><time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></span></div></header>
  <div className="wrap">{typeof post.image === "object" && post.image?.url && <div className="blog-cover article-cover"><SceneImage src={post.image.url} alt={post.image.alt || post.title} priority /></div>}
   <div className="article-layout">
    <aside className="article-aside">{sections.length > 0 && <nav aria-label="In this article"><p className="section-label">In this article</p><ol>{sections.map(section => <li key={section.id}><a href={"#" + section.id}>{section.label}</a></li>)}</ol></nav>}<div className="article-aside-contact"><p>Thinking about your own project?</p><LinkArrow href={contact}>Talk it through</LinkArrow></div></aside>
    <ArticleBody body={post.body} />
   </div>
   <section className="article-cta" aria-labelledby="article-cta-title"><div><p className="section-label">From reading to doing</p><h2 id="article-cta-title">What would you like<br />to move forward?</h2><p>Share your website, your challenge, or the idea you are working through. We will find a useful place to start.</p></div><div className="article-cta-actions"><a className="article-contact-button" href={contact}>Tell us about your project <span aria-hidden="true"><ArrowIcon /></span></a>{service && <a href={service}>Explore how we can help <ArrowIcon /></a>}</div></section>
  </div>
 </article>{related.length > 0 && <section className="wrap article-related" aria-label="Keep exploring"><h2>Keep exploring.</h2><div>{related.map(item=><a href={"/blog/"+item.slug} key={item.id}><span className="section-label">More perspective</span><h3>{item.title}</h3><span>Read article <ArrowIcon /></span></a>)}</div></section>}</main>;
}
