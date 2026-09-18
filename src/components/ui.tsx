import ArrowIcon from "@/components/ArrowIcon";
import ParticleMark from "@/components/ParticleMark";
import Image from "next/image";
import type { Project, Site } from "@/lib/content";
import { asset } from "@/lib/cms";

export function LinkArrow({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={"text-link " + className}>
      <span>{children}</span>
      <span aria-hidden><ArrowIcon /></span>
    </a>
  );
}
export function SceneImage({
  src,
  alt = "",
  className = "",
  priority = false,
  sizes = "100vw",
  unoptimized = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) {
    const url = new URL(src);
    if (url.origin === new URL(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").origin) src = url.pathname + url.search;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      quality={85}
      unoptimized={unoptimized}
    />
  );
}
export function ProjectTile({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article className={"project-tile tone-" + project.tone}>
      <a
        href={"/work/" + project.slug}
        className={
          "project-art project-art--photographic" +
          (!project.concept ? " project-art--nova" : "")
        }
      >
        <span className="sr-only">View {project.title} project</span>
        <SceneImage src={asset(project)} alt={project.image?.alt || project.title + " website and campaign concept presentation"} sizes="(max-width: 760px) 100vw, 65vw" />
        <span className="project-art-title">{project.title}</span>
        <span className="project-art-note">
          {project.sector}
          <br />
          {project.year}
        </span>
        <span className="project-go" aria-hidden>
          <ArrowIcon />
        </span>
      </a>
      <div className="project-caption">
        <div>
          <h3>
            <a href={"/work/" + project.slug}>{project.title}</a>
          </h3>
          <p>{project.descriptor}</p>
        </div>
        <span className="meta">
          {project.concept ? "Independent concept" : project.sector}
        </span>
      </div>
    </article>
  );
}
export function Closing({ site, sparkMark = false }: { site: Site; sparkMark?: boolean }) {
  return (
    <section className="closing wrap" data-sc-act="flow">
      {sparkMark && <a className="closing-mark" href="/book" aria-label="Start a conversation with Paertner"><ParticleMark /></a>}
      <div className="closing-top">
        <span className="section-label">The next opening</span>
        <p>{site.ctaBody}</p>
      </div>
      <h2>{site.ctaTitle}</h2>
      <a className="closing-link" href="/book">
        <span>Book a call</span>
        <span aria-hidden><ArrowIcon /></span>
      </a>
    </section>
  );
}
export function Footer({ site, services }: { site: Site; services: { label: string; href: string }[] }) {
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <a href="/" aria-label="Paertner home">
          <img
            src="/identity/wordmark-light.svg"
            alt="Paertner"
            width="240"
            height="56"
          />
        </a>
        <p>{site.tagline}</p>
        <a href={"mailto:" + site.email}>{site.email}</a>
      </div>
      <nav className="footer-services" aria-label="Footer services">
        <a href="/services" className="footer-services-heading">Our services</a>
        <div>{services.map(service => <a href={service.href} key={service.href}>{service.label}<span aria-hidden="true"><ArrowIcon /></span></a>)}</div>
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Paertner</span>
        <span>Based in the US. Built for what’s next.</span>
        <nav aria-label="Legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <a href="#top">Back to top <ArrowIcon direction="up" /></a>
      </div>
    </footer>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      {items.map((i, n) => (
        <span key={n}>
          <span aria-hidden>/</span>
          {i.href ? (
            <a href={i.href}>{i.label}</a>
          ) : (
            <span aria-current="page">{i.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
