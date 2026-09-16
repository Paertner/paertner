"use client";
import { useEffect, useRef } from "react";
import { logoStars } from "@/lib/logo-stars";
import { logoStreams } from "@/lib/logo-streams";

export default function ParticleMark() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, visible = false, phase = 0, previous = 0;
    let width = 600, height = 312;
    const pointer = { x: 300, y: 156, targetX: 300, targetY: 156, strength: 0, active: false, vx: 0, vy: 0 };
    const surface = canvas.parentElement!;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      if (!pointer.active) { pointer.x = pointer.targetX; pointer.y = pointer.targetY; }
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("pointercancel", leave);
    let step = 1/60;
    const offsets = Array.from({length: 5470}, () => ({x:0,y:0,vx:0,vy:0}));
    // Each star carries momentum, so a cursor sweep bends the field and leaves a soft wake.
    const interact = (x: number, y: number, depth: number, index: number): [number, number] => {
      const state = offsets[index];
      if (reduced.matches) { state.x=state.y=state.vx=state.vy=0; return [x,y]; }
      const dx = pointer.x-x, dy = pointer.y-y;
      const radius = Math.min(110, width*.2);
      const falloff = Math.max(0, 1-Math.hypot(dx,dy)/radius);
      const influence = falloff*falloff*(3-2*falloff)*pointer.strength;
      const mass = .65+depth*.35;
      const targetX = (dx*.65 + pointer.vx*.065)*influence*mass;
      const targetY = (dy*.65 + pointer.vy*.065)*influence*mass;
      const spring = 48 + depth*24;
      const drag = Math.exp(-10*step);
      state.vx = (state.vx+(targetX-state.x)*spring*step)*drag;
      state.vy = (state.vy+(targetY-state.y)*spring*step)*drag;
      state.x += state.vx*step; state.y += state.vy*step;
      return [x+state.x,y+state.y];
    };
    const random = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
    // Reuse luminous sprites instead of creating thousands of gradients per frame.
    const sprites = ["151,218,255", "87,199,250", "228,246,255"].map(color => {
      const sprite = document.createElement("canvas"); sprite.width = sprite.height = 64;
      const c = sprite.getContext("2d")!;
      const glow = c.createRadialGradient(32,32,0,32,32,32);
      glow.addColorStop(0,"rgba(255,255,255,1)");
      glow.addColorStop(.06,`rgba(${color},.95)`);
      glow.addColorStop(.16,`rgba(${color},.35)`);
      glow.addColorStop(.4,`rgba(${color},.055)`);
      glow.addColorStop(1,`rgba(${color},0)`);
      c.fillStyle = glow; c.fillRect(0,0,64,64); return sprite;
    });
    const particles = Array.from({length: 5200}, (_,i) => ({
      u: random(i+1), spread: (random(i+5)+random(i+17)+random(i+39)-1.5),
      depth: random(i+80), speed: .012+random(i+90)*.012,
      color: random(i+23)<.22 ? 1 : random(i+24)<.3 ? 2 : 0,
      bright: i%53===0, seed: random(i+30)*Math.PI*2,
    }));
    const paint = () => {
      ctx.clearRect(0,0,width,height);
      ctx.globalCompositeOperation = "lighter";
      const scale = width/600;
      // Uneven star clouds fill the actual mark, while flowing filaments carry its edges.
      particles.forEach((p,i) => {
        let x:number, y:number;
        if(i<3100) {
          const track = logoStreams[i%5===0?1:0];
          const orbitSpeed = i % 5 === 0 ? p.speed : p.speed * .45;
          const index = ((p.u+phase*orbitSpeed)%1)*track.length;
          const a=track[Math.floor(index)], b=track[(Math.floor(index)+1)%track.length];
          const f=index-Math.floor(index);
          const dx=(b[0]-a[0])*width,dy=(b[1]-a[1])*height;
          const length=Math.hypot(dx,dy)||1;
          const spread=p.spread*(5+10*p.depth)*scale;
          x=width*(.5+(a[0]+(b[0]-a[0])*f)*.84)-dy/length*spread;
          y=height*(.5+(a[1]+(b[1]-a[1])*f)*.84)+dx/length*spread;
        } else {
          const point=logoStars[700+(i%550)];
          const angle=p.seed+phase*(.12+p.depth*.18);
          x=width*(.5+point[0]*.84)+Math.cos(angle)*(2+p.depth*5)*scale;
          y=height*(.5+point[1]*.84)+Math.sin(angle)*(2+p.depth*5)*scale;
        }
        [x,y] = interact(x,y,p.depth,i);
        const light=.58+.42*Math.sin(phase*(.7+p.depth)+p.seed)**2;
        const cluster=.55+.45*Math.sin(p.u*43+p.seed*.15)**2;
        ctx.globalAlpha=light*cluster;
        if(p.bright) {
          const size=(18+p.depth*22)*scale;
          ctx.drawImage(sprites[p.color],x-size/2,y-size/2,size,size);
          ctx.fillStyle="#f3fbff";ctx.beginPath();ctx.arc(x,y,(.8+p.depth*.6)*scale,0,Math.PI*2);ctx.fill();
        } else {
          ctx.globalAlpha *= .35+p.depth*.65;
          ctx.fillStyle=["#70bfea","#55c9f7","#d7edfa"][p.color];
          const radius=(.25+p.depth*.62)*scale;
          ctx.fillRect(x,y,radius*1.5,radius*1.5);
        }
      });
      // A compact luminous knot gives the crossing depth without washing out its silhouette.
      for(let i=0;i<90;i++) {
        const angle=i*2.39996+phase*(.15+random(i)*.2);
        const r=Math.pow(random(i+300),2)*22*scale;
        const [x,y]=interact(width*.505+Math.cos(angle)*r, height*.51+Math.sin(angle)*r*.65, .7, 5200+i);
        const size=(i%11===0?34:8)*scale;
        ctx.globalAlpha=i%11===0?.5:.8;
        ctx.drawImage(sprites[2],x-size/2,y-size/2,size,size);
      }
      for(let i=0;i<180;i++) {
        const [x,y]=interact(width*random(i+800)+Math.sin(phase*.07+i)*2*scale, height*random(i+1000)+Math.cos(phase*.08+i)*2*scale, .3, 5290+i);
        ctx.globalAlpha=.12+random(i+600)*.35;
        ctx.fillStyle=i%4===0?"#a6edff":"#98d6f5";
        ctx.fillRect(x,y,.7*scale,.7*scale);
      }
      ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";canvas.dataset.ready="true";
    };
    const tick = (time:number) => {
      frame=0;
      if(!visible||document.hidden||reduced.matches){previous=0;return;}
      const dt = previous ? Math.min(time-previous,50)/1000 : 1/60;
      phase += dt; previous=time; step=dt;
      const follow = 1-Math.exp(-dt/ .1);
      const oldX=pointer.x, oldY=pointer.y;
      pointer.x += (pointer.targetX-pointer.x)*follow;
      pointer.y += (pointer.targetY-pointer.y)*follow;
      pointer.vx=Math.max(-900,Math.min(900,(pointer.x-oldX)/dt));
      pointer.vy=Math.max(-900,Math.min(900,(pointer.y-oldY)/dt));
      pointer.strength += ((pointer.active?1:0)-pointer.strength)*(1-Math.exp(-dt/ .3));
      paint();frame=requestAnimationFrame(tick);
    };
    const wake=()=>{if(!frame&&visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);};
    const measure=()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);paint();wake();};
    const preference=()=>{cancelAnimationFrame(frame);frame=0;previous=0;paint();wake();};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;previous=0;}},{rootMargin:"80px"});observer.observe(canvas);
    const resize=new ResizeObserver(measure);resize.observe(canvas);
    reduced.addEventListener("change",preference);document.addEventListener("visibilitychange",preference);measure();
    return()=>{surface.removeEventListener("pointermove",move);surface.removeEventListener("pointerleave",leave);surface.removeEventListener("pointercancel",leave);cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();reduced.removeEventListener("change",preference);document.removeEventListener("visibilitychange",preference);};
  },[]);
  return <span className="particle-mark"><canvas ref={ref} aria-hidden="true"/><img src="/brand/mark.svg" alt="" width="841" height="437"/></span>;
}
