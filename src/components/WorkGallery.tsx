"use client";
import { useState } from "react";
export default function WorkGallery({
  items,
}: {
  items: { id: number; categories: string[]; node: React.ReactNode }[];
}) {
  const [filter, setFilter] = useState("All");
  const shown = items.filter((i) => filter === "All" || i.categories.includes(filter));
  const filters = ["All", "Solutions Development", "UI/UX design", "Brand & graphic design", "Social & campaigns", "SEO & analysis"];
  return (
    <>
      <div className="filters" aria-label="Filter projects">
        {filters.filter((f) => f === "All" || items.some((i) => i.categories.includes(f))).map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            aria-controls="portfolio-results"
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} projects shown
      </p>
      <div className="work-grid" id="portfolio-results">
        {shown.map((i) => (
          <div key={i.id} className="gallery-item">
            {i.node}
          </div>
        ))}
      </div>
    </>
  );
}
