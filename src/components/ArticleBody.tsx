import type { ReactNode } from "react";

export function articleBlocks(body: string) {
  return body.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
}
export function articleSections(body: string) {
  return articleBlocks(body).flatMap((block, index) => block.startsWith("## ") ? [{ id: `section-${index}`, label: block.slice(3) }] : []);
}
function inline(text: string) {
  // Only local links are supported; HTML in authored content remains plain text.
  const pattern = /\[([^\]]+)\]\((\/(?![\/\\])[^\s)\\]+)\)/g;
  const parts: ReactNode[] = []; let end = 0;
  for (const match of text.matchAll(pattern)) {
    parts.push(text.slice(end, match.index));
    parts.push(<a key={match.index} href={match[2]}>{match[1]}</a>);
    end = match.index! + match[0].length;
  }
  parts.push(text.slice(end));
  return parts;
}
export default function ArticleBody({ body }: { body: string }) {
  return <div className="blog-body">{articleBlocks(body).map((block, index) => {
    if (block.startsWith("## ")) return <h2 id={`section-${index}`} key={index}>{block.slice(3)}</h2>;
    if (block.split("\n").every(line => line.startsWith("- "))) return <ul className="article-checklist" key={index}>{block.split("\n").map((line, i) => <li key={i}>{inline(line.slice(2))}</li>)}</ul>;
    return <p key={index}>{inline(block)}</p>;
  })}</div>;
}
