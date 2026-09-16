import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const base = process.env.MEDIA_IMPORT_URL || "http://localhost:3000";
const login = await fetch(base + "/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: process.env.INITIAL_ADMIN_EMAIL, password: process.env.INITIAL_ADMIN_PASSWORD }) });
if (!login.ok) throw new Error("Local admin authentication failed: " + login.status);
const { token } = await login.json();
const headers = { Authorization: "JWT " + token };
async function api(route, method = "GET", data) {
 const r = await fetch(base + "/api/" + route, { method, headers: { ...headers, ...(data ? { "Content-Type": "application/json" } : {}) }, body: data ? JSON.stringify(data) : undefined });
 if (!r.ok) throw new Error(method + " " + route + ": " + r.status + " " + (await r.text()).slice(0,300));
 return r.json();
}
const collections = await Promise.all([api("projects?limit=100&depth=0"), api("services?limit=100&depth=0"), api("pages?limit=100&depth=0"), api("globals/site?depth=0")]);
await fs.mkdir(".local", {recursive:true});
await fs.writeFile(".local/media-import-before-" + Date.now() + ".json", JSON.stringify(collections,null,2));
let uploaded = 0;
async function media(file, alt) {
 const filename = path.basename(file);
 const existing = await api("media?where[filename][equals]=" + encodeURIComponent(filename) + "&limit=1");
 if(existing.docs[0]) return existing.docs[0].id;
 const form = new FormData();form.append("_payload", JSON.stringify({alt}));form.append("file",new Blob([await fs.readFile(file)],{type:"image/webp"}),filename);
 const r=await fetch(base+"/api/media",{method:"POST",headers,body:form});if(!r.ok)throw Error("Upload failed: "+filename+" "+await r.text());
 const {doc}=await r.json();if(doc.mimeType!=="image/webp")throw Error("Unexpected format");uploaded++;console.log("Imported "+filename);return doc.id;
}
for (const [index, collection, suffix] of [[0,"projects","studio"],[1,"services","paertner"]]) {
 for(const doc of collections[index].docs) {
  const file = "public/images/"+(collection==="projects"?"project":"service")+"-"+doc.slug+"-"+suffix+".webp";
  try { await fs.access(file); } catch { continue; }
  const id=await media(file,doc.title+" — "+(collection==="projects"?"project presentation":"service illustration"));
  if(!doc.image) await api(collection+"/"+doc.id,"PATCH",{image:id});
 }
}
const studio=await media("public/images/digital-web.webp","Paertner website design and responsive layouts");
const booking=await media("public/images/digital-search.webp","Search strategy and digital discovery illustration");
const poster=await media("public/video/paertner-atmosphere-poster.webp","Blue light moving through a cinematic landscape");
const site=collections[3];const siteImages={...(!site.studioImage?{studioImage:studio}:{}),...(!site.socialImage?{socialImage:studio}:{}),...(!site.heroPoster?{heroPoster:poster}:{})};if(Object.keys(siteImages).length)await api("globals/site","POST",siteImages);
for(const [slug,title,intro] of [["home",site.heroTitle,site.heroDescription],["studio",site.studioTitle,site.studioBody],["privacy","Privacy policy","How Paertner handles personal information."],["terms","Terms of use","Terms for using the Paertner website."],["blog","Ideas & insights","Notes on websites, marketing and building what comes next."]]) {
 if(!collections[2].docs.some(p=>p.slug===slug))await api("pages","POST",{slug,title,intro});
}
const book=collections[2].docs.find(p=>p.slug==="book");if(book&&!book.image)await api("pages/"+book.id,"PATCH",{image:booking});
console.log("Complete. New media records: "+uploaded);
