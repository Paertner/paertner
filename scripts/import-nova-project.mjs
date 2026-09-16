import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { projectSeeds } from "../src/lib/content.ts";

nextEnv.loadEnvConfig(process.cwd());

const base = process.env.MEDIA_IMPORT_URL || "http://localhost:3000";
const project = projectSeeds.find(
  (item) => item.slug === "nova-refrigeration-appliance",
);

if (!project) throw new Error("Nova project seed is missing.");

const login = await fetch(base + "/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: process.env.INITIAL_ADMIN_EMAIL,
    password: process.env.INITIAL_ADMIN_PASSWORD,
  }),
});

if (!login.ok) throw new Error("Local admin authentication failed: " + login.status);

const { token } = await login.json();
const headers = { Authorization: "JWT " + token };

async function api(route, method = "GET", data) {
  const response = await fetch(base + "/api/" + route, {
    method,
    headers: {
      ...headers,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(
      method + " " + route + ": " + response.status + " " + (await response.text()).slice(0, 300),
    );
  }
  return response.json();
}

async function uploadMedia(imagePath, alt) {
  const filename = path.basename(imagePath);
  const contentType = path.extname(imagePath).toLowerCase() === ".png" ? "image/png" : "image/webp";
  const existingMedia = await api(
    "media?where[filename][equals]=" + encodeURIComponent(filename) + "&limit=1",
  );
  if (existingMedia.docs[0]?.id) return existingMedia.docs[0].id;
  const form = new FormData();
  form.append("_payload", JSON.stringify({ alt }));
  form.append(
    "file",
    new Blob([await fs.readFile(imagePath)], { type: contentType }),
    filename,
  );
  const upload = await fetch(base + "/api/media", {
    method: "POST",
    headers,
    body: form,
  });
  if (!upload.ok) throw new Error("Nova image upload failed: " + upload.status);
  return (await upload.json()).doc.id;
}

const imageId = await uploadMedia(
  "public/images/project-nova-kitchen-v1.png",
  "Nova appliance repair website on a laptop and phone in a sunlit kitchen with navy service cards and copper repair details",
);
const homepageId = await uploadMedia(
  "public/images/project-nova-homepage-detail-v4.png",
  "Nova appliance repair homepage with same-day service actions",
);
const servicesId = await uploadMedia(
  "public/images/project-nova-services-detail-v4.png",
  "Nova appliance repair services page and service-card system",
);
const screens = [
  {
    image: homepageId,
    caption: "Homepage — urgent-service messaging and direct contact paths.",
  },
  {
    image: servicesId,
    caption: "Services — focused appliance categories and refrigeration expertise.",
  },
];

const existing = await api(
  "projects?where[slug][equals]=" + encodeURIComponent(project.slug) + "&limit=1&depth=0",
);

if (existing.docs[0]) {
  await api("projects/" + existing.docs[0].id, "PATCH", {
    ...project,
    image: imageId,
    screens,
  });
  console.log("Updated Nova portfolio project and presentation image.");
} else {
  await api("projects", "POST", { ...project, image: imageId, screens });
  console.log("Imported Nova portfolio project and presentation image.");
}

const previousWorkIntro =
  "Independent concepts that explore our approach to strategy, design, and digital experiences. Real client stories will follow.";
const workIntro =
  "Selected client work across strategy, design, and digital experiences.";
const workPages = await api("pages?where[slug][equals]=work&limit=1&depth=0");
if (workPages.docs[0]?.intro === previousWorkIntro) {
  await api("pages/" + workPages.docs[0].id, "PATCH", { intro: workIntro });
}

const site = await api("globals/site?depth=0");
if (site.workDescription === previousWorkIntro) {
  await api("globals/site", "POST", { workDescription: workIntro });
}

await import("./import-nova-gallery.mjs");
