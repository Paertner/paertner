"use client";
import ArrowIcon from "@/components/ArrowIcon";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="error-page wrap">
      <h1>A brief pause.</h1>
      <p>We could not load this page. Please try again.</p>
      <button className="text-link" onClick={reset}>
        Try again <ArrowIcon />
      </button>
    </main>
  );
}
