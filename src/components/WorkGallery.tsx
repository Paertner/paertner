"use client";
import { useState } from "react";
export default function WorkGallery({
  items,
}: {
  items: { id: number; category: string; node: React.ReactNode }[];
}) {
  const [filter, setFilter] = useState("All");
  const shown = items.filter((i) => filter === "All" || i.category === filter);
  return (
    <>
      <div className="filters" aria-label="Filter projects">
        {["All", "SEO", "Social & campaigns", "Web development"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} projects shown
      </p>
      <div className="work-grid">
        {shown.map((i) => (
          <div key={i.id} className="gallery-item">
            {i.node}
          </div>
        ))}
      </div>
    </>
  );
}
