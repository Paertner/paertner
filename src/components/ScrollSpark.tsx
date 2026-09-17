"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { logoParticles } from "@/lib/logo-particles";
import { SIMPLE_CLOSING_QUERY } from "@/lib/closing-motion";

/** Page-owned choreography; the shared ScrollCraft engine remains unchanged. */
export default function ScrollSpark() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = ref.current;
    const main = document.querySelector<HTMLElement>(".digital-home");
    const entrance = main?.querySelector<HTMLElement>(".entrance");
    if (!svg || !main || !entrance) return;
    const trail = svg.querySelector<SVGPathElement>("[data-spark-trail]")!;
    const core = svg.querySelector<SVGGElement>("[data-spark-core]")!;
    const headTrail = svg.querySelector<SVGGElement>("[data-head-trail]")!;
    const headDust = Array.from(headTrail.querySelectorAll<SVGCircleElement>("circle"));
    let lastPaintScroll: number | null = null;
    let trailEnergy = 0;
    const head = svg.querySelector<SVGGElement>("[data-spark-head]")!;
    const headGlow = svg.querySelector<SVGCircleElement>("[data-head-glow]")!;
    const ember = svg.querySelector<SVGPathElement>("[data-head-ember]")!;
    let flight: { x: number; y: number } | null = null;
    let flightLead: { x: number; y: number } | null = null;
    const wakeGradient = svg.querySelector<SVGLinearGradientElement>("[data-spark-gradient]")!;
    const video = entrance.querySelector<HTMLVideoElement>("video");
    const burstTime = 5.8;
    let launchReady = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const simpleClosing = matchMedia(SIMPLE_CLOSING_QUERY);
    let frame = 0;
    let current = scrollY;
    let target = current;
    let previousTime = 0;
    const motes = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-spark-mote]"));
    const particles: { x: number; y: number; vx: number; vy: number; born: number; life: number; size: number }[] = [];
    let history: { x: number; y: number; time: number }[] = [];
    let lastEmission = 0;
    let phase = 0;
    let heading = 0;
    let width = innerWidth;
    let height = innerHeight;
    let start = 0;
    let finish = 0;
    const closing = main.querySelector<HTMLElement>(".closing");
    const closingMark = closing?.querySelector<HTMLElement>(".closing-mark");
    const burst = svg.querySelector<SVGGElement>("[data-spark-burst]")!;
    const rays = Array.from(burst.querySelectorAll<SVGCircleElement>("[data-burst-ray]"));
    // Sample once so particles have individual trajectories without frame-to-frame jitter.
    const burstParticles = rays.map(() => ({
      angle: Math.random() * Math.PI * 2,
      reach: .08 + Math.sqrt(Math.random()) * 1.02,
      delay: Math.random() * .045,
      travel: .29 + Math.random() * .19,
      bend: (Math.random() - .5) * 100,
      radius: .9 + Math.pow(Math.random(), 3) * 20,
      brightness: .35 + Math.random() * .65,
      settleAt: .43 + Math.random() * .12,
      target: logoParticles[Math.floor(Math.random() * logoParticles.length)],
    }));
    const syncHeader = (visible: boolean) => {
      const root = document.documentElement;
      if (root.hasAttribute("data-spark-launched") === visible) return;
      root.toggleAttribute("data-spark-launched", visible);
      window.dispatchEvent(new Event("paertner:spark-launch"));
    };
    const burstDuration = 1.5;
    let burstAt = -1;
    let burstX = 0;
    let burstY = 0;
    let closingTop = 0;
    let cursor: { x: number; y: number } | null = null;
    const restoreClosing = () => { if (closing) { closing.style.removeProperty("clip-path"); closing.style.removeProperty("--closing-logo-reveal"); } };
    let orbitStrength = 0;
    let orbitX = 0;
    let orbitY = 0;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };

    const point = (scroll: number) => {
      const travel = Math.max(0, (scroll - start) / height);
      // Stay at an outer edge for long stretches, crossing only twice.
      // Quintic easing gives each crossing a soft departure and arrival.
      const progress = clamp((scroll - start) / Math.max(height, finish - start));
      const crossing = (from: number, to: number) => {
        const t = clamp((progress - from) / (to - from));
        return t * t * t * (t * (t * 6 - 15) + 10);
      };
      const side = 1 - crossing(.25, .39) + crossing(.61, .75);
      const margin = width < 861 ? 58 : 145;
      const x = margin + (width - margin * 2) * side;
      // Slow vertical arcs vary the height while the horizontal edge pattern stays intact.
      const y = height * (.5 + .13 * Math.sin(progress * Math.PI * 5));
      // Map the burst's image coordinates through the actual cover crop.
      const rect = video?.getBoundingClientRect();
      const vw = video?.videoWidth || 1764;
      const vh = video?.videoHeight || 1176;
      const fit = rect ? Math.max(rect.width / vw, rect.height / vh) : 1;
      const originX = rect ? rect.left + (rect.width - vw * fit) * (width < 861 ? .75 : .5) + vw * fit * .75 : width * .75;
      const stageTop = entrance.querySelector<HTMLElement>(".entrance-stage")?.getBoundingClientRect().top || 0;
      const originY = rect ? rect.top - stageTop + (rect.height - vh * fit) * .5 + vh * fit * .28 : height * .28;
      const departure = ease(travel / .95);
      return { x: originX + (x - originX) * departure, y: originY + (y - originY) * departure };
    };
    const paint = (time: number, dt: number) => {
      const simple = simpleClosing.matches;
      if (current < finish - height * .6 && burstAt >= 0) { burstAt = -1; restoreClosing(); }
      const destination = point(current);
      const p = { ...destination };
      const gather = ease((current - finish + height * .6) / (height * .6));
      const markRect = simple ? closingMark?.getBoundingClientRect() : null;
      const anchorY = Math.max(130, Math.min(height * .8, markRect ? markRect.top + markRect.height / 2 : closingTop - scrollY + 85));
      p.x += (width * .5 - p.x) * gather;
      p.y += (anchorY - p.y) * gather;
      // Two-stage damping carries momentum through scroll changes and reversals.
      if (!flight || !flightLead || current < start) {
        flight = { ...p }; flightLead = { ...p };
      }
      const follow = 1 - Math.exp(-dt / 105);
      flightLead.x += (p.x - flightLead.x) * follow;
      flightLead.y += (p.y - flightLead.y) * follow;
      flight.x += (flightLead.x - flight.x) * follow;
      flight.y += (flightLead.y - flight.y) * follow;
      p.x = flight.x; p.y = flight.y;
      // Continuous small-scale wandering lives on top of the scroll route.
      const drift = (1 - gather) * (width < 861 ? .5 : 1);
      p.x += (Math.sin(phase * .83) * 7 + Math.sin(phase * 1.71) * 2.5) * drift;
      p.y += (Math.cos(phase * .67) * 6 + Math.sin(phase * 1.37) * 3) * drift;
      if (closing && burstAt < 0 && current >= finish - 1) {
        burstAt = time; burstX = p.x; burstY = p.y; history = []; particles.length = 0;
      }
      const elapsed = burstAt < 0 ? -1 : (time - burstAt) / 1000;
      const exploding = !simple && elapsed >= 0 && elapsed < burstDuration;
      const settling = simple && elapsed >= 0 && elapsed < .45;
      // Wait for the decoder to reach the flash, not only its requested scroll time.
      if (current < start - height * .15) launchReady = false;
      if (current >= start && (!video || video.readyState < 2 || video.currentTime >= burstTime - .04)) launchReady = true;
      const opacity = launchReady ? ease((current - start) / (height * .09)) : 0;
      syncHeader(opacity > .01);
      const active = opacity > .01 && elapsed < 0;
      const sparkOpacity = elapsed < 0 ? 1 : simple ? 1 - ease(elapsed / .2) : 0;
      core.setAttribute("opacity", String(sparkOpacity));
      trail.setAttribute("opacity", String(sparkOpacity));
      burst.setAttribute("opacity", exploding ? "1" : "0");
      if (exploding) {
        const t = clamp(elapsed / burstDuration);
        burst.setAttribute("transform", `translate(${burstX} ${burstY})`);
        const markRect = closingMark?.getBoundingClientRect();
        const markX = markRect ? markRect.left + markRect.width / 2 - burstX : 0;
        const markY = markRect ? markRect.top + markRect.height / 2 - burstY : 0;
        rays.forEach((ray, i) => {
          const particle = burstParticles[i];
          const angle = particle.angle;
          const travel = clamp((t - particle.delay) / particle.travel);
          const expansion = 1 - Math.pow(1 - travel, 2.5);
          const settle = ease((t - particle.settleAt) / (1 - particle.settleAt));
          // Scale every ray to its viewport edge so tall and wide screens both fill.
          const dx = Math.cos(angle), dy = Math.sin(angle);
          const edgeX = (dx > 0 ? width-burstX : burstX) / Math.max(Math.abs(dx), .0001);
          const edgeY = (dy > 0 ? height-burstY : burstY) / Math.max(Math.abs(dy), .0001);
          const distance = Math.min(edgeX, edgeY) * expansion * particle.reach;
          const target = particle.target;
          const drift = Math.sin(travel * Math.PI * .5) * particle.bend;
          const x = dx * distance - dy * drift;
          const y = dy * distance + dx * drift;
          ray.setAttribute("cx", String(x + (markX + target[0] * (markRect?.width || 280) * .84 - x) * settle));
          ray.setAttribute("cy", String(y + (markY + target[1] * (markRect?.height || 146) * .84 - y) * settle));
          ray.setAttribute("r", String(particle.radius * (width < 861 ? .7 : 1) * (1 - settle * .85)));
          ray.setAttribute("opacity", String(particle.brightness * ease((t - particle.delay) / .04) * (1 - ease((t - .83) / .17))));
        });
      }
      if (closing && !closing.contains(document.activeElement)) {
        if (simple) {
          closing.style.removeProperty("clip-path");
          closing.style.setProperty("--closing-logo-reveal", String(elapsed < 0 ? (gather > 0 ? 0 : 1) : ease((elapsed - .1) / .35)));
        }
        else if (elapsed < 0 && gather > 0) { closing.style.clipPath = "circle(0px at 50% 85px)"; closing.style.setProperty("--closing-logo-reveal", "0"); }
        else if (elapsed >= 0 && elapsed < burstDuration) {
          closing.style.setProperty("--closing-logo-reveal", String(ease((elapsed / burstDuration - .8) / .2)));
          const radius = ease(elapsed / burstDuration) * Math.hypot(width, closing.offsetHeight);
          closing.style.clipPath = `circle(${radius}px at 50% 85px)`;
        } else restoreClosing();
      }
      const scrollSpeed = lastPaintScroll === null ? 0 : Math.abs(current - lastPaintScroll) / Math.max(dt, 1) * 1000;
      lastPaintScroll = current;
      const moving = scrollSpeed > 8;
      const desiredEnergy = active && moving ? clamp(scrollSpeed / 650) : 0;
      trailEnergy += (desiredEnergy - trailEnergy) * (1 - Math.exp(-dt / (moving ? 85 : 160)));
      if (trailEnergy < .002) trailEnergy = 0;
      headTrail.setAttribute("opacity", String(active ? .4 + trailEnergy * .6 : 0));

      const scale = width < 861 ? .48 : 1;
      phase += dt / 1000;
      headDust.forEach((dust,i) => {
        const clock = phase / (.45 + (i % 7) * .09) + i * .618;
        const age = clock % 1;
        const seed = i * 2.39996 + Math.floor(clock) * 1.73;
        dust.setAttribute("cx", String(-2 - age * (14 + 12 * Math.sin(seed) ** 2)));
        dust.setAttribute("cy", String(Math.sin(seed) * age * 14 + Math.sin(age * 5 + seed) * 2));
        dust.setAttribute("r", String((1.2 + Math.cos(seed * 1.3) ** 2 * 3) * (1 - age * .65)));
        dust.setAttribute("opacity", String(Math.sin(age * Math.PI) ** 2));
      });
      const breath = 1 + Math.sin(phase * 2.1) * .055 + Math.sin(phase * 3.7) * .025;
      head.setAttribute("transform", `rotate(${Math.sin(phase * 1.2) * 12 + Math.sin(phase * 2.7) * 5}) scale(${1.9 * breath})`);
      const flicker = Math.sin(phase * 8.3) * .65 + Math.sin(phase * 13.7) * .35;
      ember.setAttribute("d", `M${-6 - flicker} 0 Q-2 ${-3.2 + flicker} 3 -1.2 Q${6 + flicker} 0 2 1.8 Q-2 ${3 + flicker} ${-6 - flicker} 0Z`);
      headGlow.setAttribute("opacity", String(.62 + Math.sin(phase * 2.1) * .1 + Math.sin(phase * 4.3) * .035));
      headGlow.setAttribute("r", String(29 + Math.sin(phase * 1.6) * 2));
      // The wake records the head position; orbiting particles remain independent.
      // It ages in seconds rather than being reconstructed from scroll progress.
      history = history.filter(sample => time - sample.time < 1100);
      if (active && moving) history.push({ ...p, time });
      if (history.length > 90) history.shift();
      const previous = history[Math.max(0, history.length - 3)];
      if (previous && Math.hypot(p.x - previous.x, p.y - previous.y) > .4) {
        const desired = Math.atan2(p.y - previous.y, p.x - previous.x);
        heading += Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading)) * (1 - Math.exp(-dt / 140));
      }
      const points = [...history].reverse();
      const tail = points[points.length - 1] || p;
      const nearCursor = cursor && finePointer.matches && active
        ? 1 - ease((Math.hypot(cursor.x - p.x, cursor.y - p.y) - 80) / 120)
        : 0;
      const orbitFollow = 1 - Math.exp(-dt / 180);
      orbitStrength += (nearCursor - orbitStrength) * orbitFollow;
      if (cursor && nearCursor > 0) {
        const dx = (cursor.x - p.x) / scale;
        const dy = (cursor.y - p.y) / scale;
        orbitX += (dx * Math.cos(heading) + dy * Math.sin(heading) - orbitX) * orbitFollow;
        orbitY += (-dx * Math.sin(heading) + dy * Math.cos(heading) - orbitY) * orbitFollow;
      }
      if (active && moving && time - lastEmission > 28) {
        lastEmission = time;
        for (let i = 0; i < (width < 861 ? 4 : 8); i++) {
          const angle = Math.random() * Math.PI * 2;
          const spread = Math.pow(Math.random(), 1.5) * 19 * scale;
          particles.push({
            x: p.x + Math.sin(angle) * spread,
            y: p.y + Math.cos(angle) * spread,
            vx: Math.sin(angle * 2) * 14 * scale,
            vy: (-12 + Math.cos(angle) * 10) * scale,
            born: time, life: 500 + Math.random() * 650, size: (2 + Math.pow(Math.random(), 2) * 12) * scale,
          });
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        if (time - particles[i].born >= particles[i].life) particles.splice(i, 1);
      }
      if (particles.length > motes.length) particles.splice(0, particles.length - motes.length);
      motes.forEach((mote, i) => {
        const particle = particles[i];
        if (!particle) { mote.setAttribute("opacity", "0"); return; }
        particle.x += particle.vx * dt / 1000;
        particle.y += particle.vy * dt / 1000;
        const remaining = 1 - (time - particle.born) / particle.life;
        mote.setAttribute("cx", particle.x.toFixed(2));
        mote.setAttribute("cy", particle.y.toFixed(2));
        mote.setAttribute("r", String(particle.size * (.4 + remaining * .6)));
        mote.setAttribute("opacity", String(remaining * remaining * .8));
      });
      wakeGradient.setAttribute("x1", String(p.x));
      wakeGradient.setAttribute("y1", String(p.y));
      wakeGradient.setAttribute("x2", String(tail.x));
      wakeGradient.setAttribute("y2", String(tail.y));
      trail.setAttribute("d", points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "));
      core.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${heading * 180 / Math.PI}) scale(${width < 861 ? .48 : 1})`);
      svg.style.opacity = opacity.toFixed(3);
      svg.dataset.scVerifyState = `${p.x.toFixed(0)},${p.y.toFixed(0)},${opacity.toFixed(2)},${head.getAttribute("transform")},${particles.length}`;
      return active || exploding || settling || (current >= start && current < finish && !launchReady);
    };
    const tick = (time: number) => {
      frame = 0;
      if (reduced.matches || document.hidden) return;
      const dt = previousTime ? Math.min(time - previousTime, 48) : 16;
      previousTime = time;
      current += (target - current) * (1 - Math.exp(-dt / 85));
      if (Math.abs(target - current) < .1) current = target;
      const active = paint(time, dt);
      if (active || particles.length > 0 || current !== target) frame = requestAnimationFrame(tick);
      else previousTime = 0;
    };
    const wake = () => {
      if (!frame && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const next = scrollY;

      target = next;
      wake();
    };
    const onPointer = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      cursor = { x: event.clientX, y: event.clientY };
      wake();
    };
    const resetPointer = () => { cursor = null; wake(); };
    const measure = () => {
      history = [];
      flight = null; flightLead = null;
      width = innerWidth;
      height = innerHeight;
      if (!finePointer.matches) cursor = null;
      const entranceTop = entrance.getBoundingClientRect().top + scrollY;
      const clipStart = Math.max(0, entranceTop - height);
      const clipEnd = Math.min(entranceTop + entrance.offsetHeight, document.documentElement.scrollHeight - height);
      const dwell = Number(entrance.dataset.scDwell || 0);
      const fraction = burstTime / (video?.duration || 10.041667);
      let low = 0, high = 1;
      for (let i = 0; i < 24; i++) {
        const mid = (low + high) / 2;
        const remapped = (1 - dwell) * mid + dwell * (4 * Math.pow(mid - .5, 3) + .5);
        if (remapped < fraction) low = mid; else high = mid;
      }
      start = clipStart + (clipEnd - clipStart) * (low + high) / 2;
      closingTop = closing ? closing.getBoundingClientRect().top + scrollY : main.getBoundingClientRect().bottom + scrollY;
      const maxScroll = document.documentElement.scrollHeight - height;
      const arrivalTop = simpleClosing.matches && closingMark
        ? closingMark.getBoundingClientRect().top + scrollY + closingMark.offsetHeight / 2
        : closingTop;
      finish = Math.min(arrivalTop - height * .72, maxScroll - 40);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const trailFilter = svg.querySelector<SVGFilterElement>("[data-spark-trail-filter]")!;
      trailFilter.setAttribute("width", String(width + 512));
      trailFilter.setAttribute("height", String(height + 512));
      wake();
    };
    const onPreference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      current = target = scrollY;
      cursor = null; orbitStrength = 0;
      history = [];
      particles.length = 0;
      svg.style.opacity = "0";
      burstAt = -1; launchReady = false; syncHeader(false); restoreClosing();
      if (!reduced.matches) measure();
    };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
      else { current = target = scrollY; particles.length = 0; measure(); }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(main);
    observer.observe(entrance);
    if (closing) observer.observe(closing);
    closing?.addEventListener("focusin", restoreClosing);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onPreference);
    simpleClosing.addEventListener("change", onPreference);
    video?.addEventListener("loadedmetadata", measure);
    video?.addEventListener("seeked", wake);
    measure();
    return () => {
      syncHeader(false);
      cancelAnimationFrame(frame);
      observer.disconnect();
      video?.removeEventListener("loadedmetadata", measure);
      video?.removeEventListener("seeked", wake);
      restoreClosing();
      closing?.removeEventListener("focusin", restoreClosing);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onPreference);
      simpleClosing.removeEventListener("change", onPreference);
    };
  }, [mounted]);

  if (!mounted) return null;
  return createPortal(<svg ref={ref} className="scroll-spark" aria-hidden="true" focusable="false" data-sc-verify-state="hidden">
    <defs>
      <linearGradient id={`${id}-wake`} data-spark-gradient gradientUnits="userSpaceOnUse"><stop stopColor="#a8efff" stopOpacity=".45" /><stop offset="1" stopColor="#347cdb" stopOpacity="0" /></linearGradient>
      {/* Fixed filter regions avoid clipping when a trail's bounding box becomes flat. */}
      <filter id={`${id}-trail-mist`} data-spark-trail-filter filterUnits="userSpaceOnUse" x="-256" y="-256" width="2560" height="2560"><feGaussianBlur stdDeviation="1.4" /></filter>
      <radialGradient id={`${id}-star`}><stop stopColor="#ecfcff" /><stop offset=".08" stopColor="#d5f8ff" stopOpacity=".95" /><stop offset=".22" stopColor="#71dcff" stopOpacity=".48" /><stop offset=".55" stopColor="#46caff" stopOpacity=".1" /><stop offset="1" stopColor="#2189dc" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-white`}><stop stopColor="#ffffff"/><stop offset=".18" stopColor="#ffffff" stopOpacity=".98"/><stop offset=".36" stopColor="#e9faff" stopOpacity=".7"/><stop offset=".68" stopColor="#bceaff" stopOpacity=".15"/><stop offset="1" stopColor="#91d9ff" stopOpacity="0"/></radialGradient>
    </defs>
    <g data-spark-burst opacity="0">
      {Array.from({ length: 1500 }, (_, i) => <circle key={i} data-burst-ray r="0" fill={`url(#${id}-star)`} />)}
    </g>
    <path data-spark-trail fill="none" stroke="none" strokeWidth="2.5" strokeLinecap="round" filter={`url(#${id}-trail-mist)`} />
    <g>{Array.from({ length: 240 }, (_, i) => <circle key={i} data-spark-mote opacity="0" fill={`url(#${id}-${i % 3 === 0 ? "star" : "white"})`} />)}</g>
    <g data-spark-core>
      <g data-spark-head transform="scale(1.9)">
        <circle data-head-glow r="29" fill={`url(#${id}-star)`} opacity=".65" />
        <g data-head-trail opacity="0">
          {Array.from({length: 22}, (_,i) => <circle key={i} cx={-3-Math.abs(Math.sin(i*2.4))*17} cy={Math.cos(i*1.73)*6} r={1.2+(i%5)*.65} fill={`url(#${id}-white)`} />) }
          <path data-head-filament d="M-25 0Q-10-4 4 0Q-10 4-25 0Z" fill="none" opacity=".6" />
        </g>
        <path data-head-ember d="M-6 0Q-2-3.2 3-1.2Q6 0 2 1.8Q-2 3-6 0Z" fill="#c8f6ff" />
        <ellipse cx="1" rx="2.8" ry="1.6" fill="#ffffff" />
      </g>
    </g>
  </svg>, document.body);
}
