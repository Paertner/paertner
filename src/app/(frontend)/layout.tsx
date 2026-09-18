import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/ui";
import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import { getSite, getServices } from "@/lib/cms";
import { origin } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Paertner | Marketing meets making",
    template: "%s | Paertner",
  },
  description:
    "Digital marketing and remarkable websites. Connected by a better way of thinking.",
  icons: {
    icon: "/identity/favicon.svg",
    apple: "/identity/apple-touch-icon.png",
  },
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  const serviceLinks = services.map(({ slug, title }) => ({ href: "/services/" + slug, label: title }));
  return (
    <html lang="en">
      {/* Browser extensions may add body attributes before React hydrates. */}
      <body id="top" suppressHydrationWarning>
        <Header nav={site.nav} services={serviceLinks} />
        <noscript>
          <nav className="nojs-nav wrap" aria-label="Site navigation">
            {site.nav.map((n) => (
              <a href={n.href} key={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </noscript>
        {children}
        <Footer site={site} services={serviceLinks} />
        <Motion />
        <SmoothScroll />
      </body>
    </html>
  );
}
