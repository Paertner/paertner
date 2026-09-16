import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
fs.mkdirSync("data", { recursive: true });
fs.mkdirSync(".local", { recursive: true });
fs.mkdirSync("public/brand", { recursive: true });
if (!fs.existsSync(".env")) {
  const password = crypto.randomBytes(20).toString("base64url");
  fs.writeFileSync(
    ".env",
    "PAYLOAD_SECRET=" +
      crypto.randomBytes(48).toString("hex") +
      "\nNEXT_PUBLIC_SERVER_URL=http://localhost:3000\nINITIAL_ADMIN_EMAIL=admin@paertner.local\nINITIAL_ADMIN_PASSWORD=" +
      password +
      "\n",
  );
  fs.writeFileSync(
    ".local/ADMIN.md",
    "# Local admin access\n\nURL: http://localhost:3000/admin\nEmail: admin@paertner.local\nPassword: " +
      password +
      "\n\nLocal development credentials only. Set a real email and a new password before launch. Never commit this file.\n",
  );
}
for (const [src, dest] of [
  ["08-svg/paertner-wordmark-black-lime.svg", "wordmark.svg"],
  ["08-svg/paertner-wordmark-white-lime.svg", "wordmark-light.svg"],
  ["08-svg/paertner-mark-lime.svg", "mark.svg"],
  ["08-svg/favicon.svg", "favicon.svg"],
]) {
  const p = path.join("Brandkit", src);
  if (fs.existsSync(p)) {
    let s = fs
      .readFileSync(p, "utf8")
      .replace(/<metadata[\s\S]*?<\/metadata>/g, "");
    fs.writeFileSync(path.join("public/brand", dest), s);
  }
}
console.log(
  "Local environment ready. Private admin access details: .local/ADMIN.md",
);
