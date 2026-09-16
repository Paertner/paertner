import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "node:crypto";
import { cms } from "@/lib/cms";
const MAX_BYTES = 14000;
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(150).default(""),
  service: z.string().trim().max(150).default(""),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal("yes"),
  website: z.string().max(0).default(""),
});
export async function POST(req: Request) {
  const json = req.headers.get("accept")?.includes("application/json");
  const fail = (error: string, status = 400) =>
    json
      ? NextResponse.json({ error }, { status })
      : NextResponse.redirect(new URL("/book?error=1", req.url), 303);
  const origin = req.headers.get("origin");
  const requestOrigin =
    new URL(req.url).protocol + "//" + req.headers.get("host");
  if (
    origin &&
    new URL(req.url).origin !== origin &&
    requestOrigin !== origin &&
    origin !== process.env.NEXT_PUBLIC_SERVER_URL
  )
    return fail("Please submit this form from the Paertner website.", 403);
  if (Number(req.headers.get("content-length") || 0) > MAX_BYTES)
    return fail("Your message is too long.", 413);
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    const reader = req.body?.getReader();
    if (!reader) return fail("Your inquiry is empty.");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return fail("Your message is too long.", 413);
      }
      chunks.push(value);
    }
    const parsedRequest = new Request(req.url, {
      method: "POST",
      headers: {
        "Content-Type":
          req.headers.get("content-type") ||
          "application/x-www-form-urlencoded",
      },
      body: Buffer.concat(chunks),
    });
    const parsed = schema.safeParse(
      Object.fromEntries(await parsedRequest.formData()),
    );
    if (!parsed.success)
      return fail(
        "Please enter a valid name and email, at least 20 characters about your project, and accept the privacy notice.",
      );
    const p = await cms();
    const fingerprint = createHash("sha256")
      .update(
        parsed.data.email.toLowerCase() + ":" + process.env.PAYLOAD_SECRET,
      )
      .digest("hex");
    const recent = await p.count({
      collection: "inquiries",
      where: {
        and: [
          { fingerprint: { equals: fingerprint } },
          {
            createdAt: {
              greater_than: new Date(Date.now() - 3600000).toISOString(),
            },
          },
        ],
      },
    });
    if (recent.totalDocs >= 5)
      return fail(
        "We already have your recent requests. Please wait a little before sending another.",
        429,
      );
    const { consent, website, ...data } = parsed.data;
    await p.create({
      collection: "inquiries",
      data: { ...data, fingerprint, status: "new" },
      overrideAccess: true,
    });
    return json
      ? NextResponse.json({ success: true }, { status: 201 })
      : NextResponse.redirect(new URL("/book?sent=1", req.url), 303);
  } catch {
    return fail(
      "We could not save your inquiry. Please try again shortly.",
      500,
    );
  }
}
