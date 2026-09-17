import ArrowIcon from "@/components/ArrowIcon";
export function DigitalProjectArt({ title, kind = "Creation" }: { title: string; kind?: string }) {
  return <div className={"digital-project-art " + (kind === "Marketing" ? "digital-project-art--marketing" : "")} aria-hidden="true">
    <div className="project-design-plane"><div className="project-design-nav"><span>{title}</span><span>Discover <ArrowIcon /></span></div><div className="project-design-type">{title}<span>{kind === "Marketing" ? "A voice of its own." : "A new perspective."}</span></div><div className="project-design-baseline"><span>Identity meets experience.</span><span>Built with intention.</span></div></div>
    <div className="project-design-echo"><span>{title}</span><span>{kind === "Marketing" ? "Make an impression." : "A considered experience."}</span></div>
  </div>;
}
