import Link from "next/link";
import type { ServerProps } from "payload";
export default async function AdminDashboard({ payload, user }: Pick<ServerProps, "payload" | "user">) {
  if (!user) return null;
  const [projects, services, inquiries] = await Promise.all([
    payload.count({ collection: "projects", overrideAccess: false, user }),
    payload.count({ collection: "services", overrideAccess: false, user }),
    payload.count({ collection: "inquiries", where: { status: { equals: "new" } }, overrideAccess: false, user }),
  ]);
  return <section className="studio-dashboard" aria-label="Content studio overview">
    <div className="studio-dashboard__hero"><div><p className="studio-eyebrow">PAERTNER / CONTENT STUDIO</p><h2>Your next update<br />starts here.</h2><p>Shape the work, tell the story, keep the conversation going.</p></div><a className="studio-site-link" href="/" target="_blank" rel="noopener noreferrer">View website <span aria-hidden="true">↗</span><span className="studio-sr-only"> (opens in a new tab)</span></a></div>
    <div className="studio-dashboard__tasks">
      <Link href="/admin/globals/site"><span className="studio-eyebrow">01 / WEBSITE</span><h3>Edit your story <span aria-hidden="true">↗</span></h3><p>Homepage, studio, navigation and contact details.</p></Link>
      <Link href="/admin/collections/projects"><span className="studio-eyebrow">02 / SELECTED WORK</span><h3>Manage projects <span aria-hidden="true">↗</span></h3><p>{projects.totalDocs} projects · Case studies, images and publishing.</p></Link>
      <Link href="/admin/collections/services"><span className="studio-eyebrow">03 / WHAT YOU DO</span><h3>Refine services <span aria-hidden="true">↗</span></h3><p>{services.totalDocs} services · Descriptions, deliverables and imagery.</p></Link>
    </div>
    <div className="studio-dashboard__inbox"><div><span className="studio-inbox-count">{inquiries.totalDocs}</span><div><h3>New conversations</h3><p>Review inquiries and keep track of your replies.</p></div></div><Link href="/admin/collections/inquiries">Open inbox ↗</Link></div>
    <div className="studio-dashboard__utilities"><Link href="/admin/collections/projects/create">Add a project ↗</Link><Link href="/admin/collections/posts">Blog posts ↗</Link><Link href="/admin/collections/media">Media library ↗</Link><Link href="/admin/collections/pages">Page introductions ↗</Link></div>
  </section>;
}
export function LoginIntro() { return <div className="studio-login-intro"><p className="studio-eyebrow">CONTENT STUDIO</p><h1>Make your next move.</h1><p>Sign in to manage your website, work and conversations.</p></div>; }
