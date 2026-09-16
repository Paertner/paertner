"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let destination = scrollY;
    let position = scrollY;
    let lastPaint = scrollY;
    let previous = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      destination = position = lastPaint = scrollY;
    };
    const tick = (time: number) => {
      const dt = previous ? Math.min(time - previous, 48) : 16;
      previous = time;
      destination = Math.max(0, Math.min(destination, document.documentElement.scrollHeight - innerHeight));
      const next = position + (destination - position) * (1 - Math.exp(-dt / 175));
      position = next;
      const settled = Math.abs(destination - next) < 1;
      window.scrollTo({ top: settled ? destination : next, behavior: "instant" });
      lastPaint = scrollY;
      if (settled) stop();
      else frame = requestAnimationFrame(tick);
    };
    const onWheel = (event: WheelEvent) => {
      if (reduced.matches || event.ctrlKey || event.metaKey || event.shiftKey || !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (getComputedStyle(document.body).overflow === "hidden" || document.querySelector("dialog[open]")) return;
      // Native controls and independently scrolling panels keep their own behavior.
      for (const node of event.composedPath()) {
        if (!(node instanceof HTMLElement) || node === document.body) continue;
        if (node.matches("input, textarea, select, [contenteditable=true]")) return;
        const style = getComputedStyle(node);
        if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) return;
      }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (!delta) return;
      event.preventDefault();
      if (!frame) destination = position = scrollY;
      destination += delta * .78;
      destination = Math.max(0, Math.min(destination, document.documentElement.scrollHeight - innerHeight));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => { if (frame && Math.abs(scrollY - lastPaint) > 2) stop(); };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) stop();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("blur", stop);
    document.addEventListener("focusin", stop);
    reduced.addEventListener("change", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("blur", stop);
      document.removeEventListener("focusin", stop);
      reduced.removeEventListener("change", stop);
    };
  }, []);
  return null;
}
