"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Screen = { src: string; alt: string; caption: string };

export default function ProjectScreens({ screens }: { screens: Screen[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const move = (step: number) => setSelected((current) => (current + step + screens.length) % screens.length);
  const active = screens[selected];
  return <>
    <div className="case-gallery-grid">
      {screens.map((screen, index) => <figure key={screen.src}>
        <button className="case-gallery-image" aria-label={`Enlarge ${screen.caption || screen.alt}`} onClick={() => {
          setSelected(index);
          dialog.current?.showModal();
        }}>
          <Image src={screen.src} alt={screen.alt} fill sizes="(max-width: 700px) 100vw, 45vw" unoptimized />
          <span className="case-gallery-zoom" aria-hidden="true">↗</span>
        </button>
        <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{screen.caption}</figcaption>
      </figure>)}
    </div>
    <dialog ref={dialog} className="screen-viewer" aria-label="Website screen gallery" onClick={(event) => {
      if (event.target === event.currentTarget) dialog.current?.close();
    }} onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      <div className="screen-viewer-bar">
        <p aria-live="polite">{selected + 1} / {screens.length} — {active.caption}</p>
        <button onClick={() => dialog.current?.close()} autoFocus aria-label="Close gallery">Close ×</button>
      </div>
      <div className="screen-viewer-image"><Image src={active.src} alt={active.alt} fill sizes="95vw" unoptimized /></div>
      <div className="screen-viewer-controls">
        <button onClick={() => move(-1)} aria-label="Previous screen">← Previous</button>
        <button onClick={() => move(1)} aria-label="Next screen">Next →</button>
      </div>
    </dialog>
  </>;
}
