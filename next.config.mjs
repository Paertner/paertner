import { withPayload } from "@payloadcms/next/withPayload";
export default withPayload({
  poweredByHeader: false,
  outputFileTracingExcludes: {
    "/*": [
      "./Brandkit/**/*",
      "./WEBSITE_PLAN.md",
      "./scrollcraft/**/*",
      "./.local/**/*",
      "./data/**/*",
      "./.env*",
    ],
  },
  images: { qualities: [75, 85], formats: ["image/webp"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
});
