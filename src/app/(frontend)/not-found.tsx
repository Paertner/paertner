import { LinkArrow } from "@/components/ui";
export default function NotFound() {
  return (
    <main id="main" className="error-page wrap">
      <span className="section-label">404 / A different opening</span>
      <h1>
        This way
        <br />
        is still unbuilt.
      </h1>
      <p>The page may have moved, or the address may be incomplete.</p>
      <LinkArrow href="/">Back to Paertner</LinkArrow>
    </main>
  );
}
