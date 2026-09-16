import { notFound, permanentRedirect } from "next/navigation";
import { cms } from "@/lib/cms";
export default async function RedirectPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const p = "/" + (await params).path.join("/");
  const r = await (
    await cms()
  ).find({ collection: "redirects", where: { from: { equals: p } }, limit: 1 });
  if (r.docs[0]?.to && r.docs[0].to !== p) permanentRedirect(r.docs[0].to);
  notFound();
}
