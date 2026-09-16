import { getPosts, getPage } from "@/lib/cms";
import { meta } from "@/lib/seo";
import { Breadcrumb, SceneImage } from "@/components/ui";
export const generateMetadata = () => meta("Ideas & insights", "Notes on websites, marketing and building what comes next.", "/blog");
export default async function Blog() {
 const [posts, page] = await Promise.all([getPosts(), getPage("blog")]);
 return <main id="main"><section className="page-hero wrap"><Breadcrumb items={[{ label: "Blog" }]} /><h1>{page?.title || "Ideas & insights."}</h1><div className="page-intro"><p>{page?.intro || "Notes on websites, marketing and building what comes next."}</p></div></section><section className="wrap blog-grid" aria-label="Articles">{posts.length ? posts.map(post => <article key={post.id}><a href={"/blog/" + post.slug}>{typeof post.image === "object" && post.image?.url && <div className="blog-cover"><SceneImage src={post.image.url} alt={post.image.alt || post.title} sizes="(max-width: 760px) 100vw, 50vw" /></div>}<h2>{post.title}</h2><p>{post.excerpt}</p><span className="text-link">Read article ↗</span></a></article>) : <p>New perspectives are on the way. Check back for our first article.</p>}</section></main>;
}
