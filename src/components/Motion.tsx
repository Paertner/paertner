"use client";
import { useEffect } from "react";
declare global {
  interface Window { ScrollCraft?: { mount: (root?: Element) => unknown }; }
}
export default function Motion() {
  useEffect(() => {
    let cancelled = false;
    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const copy = target.closest<HTMLElement>(".entrance-copy");
      if (copy && parseFloat(getComputedStyle(copy).opacity) < .85) {
        // Apply after the shared runtime centers focused cues; this opening cue
        // is fully visible at the start of the entrance.
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
      }
      const panel = target.closest<HTMLElement>(".campaign-panel, .campaign-end");
      if (!panel || matchMedia("(max-width: 860px), (prefers-reduced-motion: reduce)").matches) return;
      const act = panel.closest<HTMLElement>(".campaigns");
      const rail = act?.querySelector<HTMLElement>(".campaign-rail");
      if (!act || !rail) return;
      const overflow = rail.scrollWidth - innerWidth;
      const travel = act.offsetHeight - innerHeight;
      if (overflow <= 0 || travel <= 0) return;
      const fraction = Math.max(0, Math.min(1, (panel.offsetLeft + panel.offsetWidth / 2 - innerWidth / 2) / overflow));
      window.scrollTo({ top: act.getBoundingClientRect().top + scrollY + travel * fraction, behavior: "instant" });
    };
    main.addEventListener("focusin", onFocus);
    const mount = () => {
      if (cancelled || main.dataset.scMounted) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compact = matchMedia("(max-width: 860px)").matches;
      main.dataset.motionMode = reduced ? "reduced" : compact ? "compact" : "full";
      main.querySelectorAll<HTMLElement>("[data-sc-adaptive]").forEach((section) => {
        if (reduced || compact) section.dataset.scAct = "flow";
      });
      const entrance = main.querySelector<HTMLElement>(".entrance");
      if (entrance) {
        if (reduced) entrance.dataset.scAct = "flow";
        else if (compact) entrance.dataset.scSpan = "2.15";
      }
      document.documentElement.classList.add("sc-booting");
      window.ScrollCraft?.mount(main);
      document.documentElement.classList.remove("sc-booting");
      main.dataset.scMounted = "true";
    };
    let script = document.getElementById("paertner-scrollcraft") as HTMLScriptElement | null;
    if (window.ScrollCraft) mount();
    else {
      if (!script) {
        script = document.createElement("script");
        script.id = "paertner-scrollcraft";
        script.src = "/vendor/scrollcraft.js";
        document.body.appendChild(script);
      }
      script.addEventListener("load", mount);
    }
    // Public links perform document navigation. The unchanged Scrollcraft runtime
    // owns one instance per document; guard the mount against React Strict Mode.
    return () => { cancelled = true; script?.removeEventListener("load", mount); main.removeEventListener("focusin", onFocus); };
  }, []);
  return null;
}
