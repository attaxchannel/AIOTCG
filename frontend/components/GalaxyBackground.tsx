'use client';
import { useEffect, useRef, useState } from 'react';

export default function GalaxyBackground(){
  const ref = useRef<HTMLCanvasElement>(null);
  const [reduced,setReduced]=useState(false);

  useEffect(()=>{
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const onChange = ()=>setReduced(media.matches);
    media.addEventListener('change', onChange);
    return ()=>media.removeEventListener('change', onChange);
  },[]);

  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    let raf=0;
    let w=0,h=0,dpr=1;
    let mx=0, my=0;
    let stars: {x:number,y:number,r:number,tw:number, ph:number}[] = [];
    let nebulae: {x:number,y:number,rx:number,ry:number, hue:number}[] = [];

    const resize = ()=>{
      dpr = Math.min(1.5, window.devicePixelRatio||1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      // regen stars density responsive
      const count = Math.floor(w*h / 4200);
      stars = Array.from({length: count}, ()=>({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.4 + 0.3,
        tw: Math.random()*0.02 + 0.006,
        ph: Math.random()*Math.PI*2
      }));
      nebulae = Array.from({length: 5}, ()=>({
        x: Math.random()*w, y: Math.random()*h*0.7,
        rx: w*0.12 + Math.random()*w*0.18,
        ry: h*0.14 + Math.random()*h*0.1,
        hue: 250 + Math.random()*60
      }));
    };

    const onMove = (e: MouseEvent | TouchEvent)=>{
      const t = (e as TouchEvent).touches?.[0] || (e as MouseEvent);
      if(!t) return;
      mx = (t.clientX / w - 0.5) * 2; // -1 to 1
      my = (t.clientY / h - 0.5) * 2;
    };

    let t0 = performance.now();
    const tick = (now:number)=>{
      const dt = (now - t0)*0.001;
      // clear with galaxy base
      const g = ctx.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#0a0a1e');
      g.addColorStop(0.35,'#13102e');
      g.addColorStop(0.7,'#0f0f23');
      g.addColorStop(1,'#070712');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);

      // nebula blobs - parallax with mouse
      nebulae.forEach((n,i)=>{
        const px = n.x + mx * (18 + i*7);
        const py = n.y + my * (12 + i*5);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, Math.max(n.rx,n.ry));
        const alpha = 0.09 + i*0.01;
        const hue = n.hue;
        grad.addColorStop(0, `hsla(${hue}, 68%, 62%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${hue+12}, 72%, 58%, ${alpha*0.35})`);
        grad.addColorStop(1,'hsla(260, 60%, 12%, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(px, py, n.rx, n.ry, (i*0.12), 0, Math.PI*2);
        ctx.fill();
      });

      // stars with twinkle + parallax
      stars.forEach(s=>{
        const px = s.x + mx * (s.r*9);
        const py = s.y + my * (s.r*6);
        const twinkle = 0.68 + Math.sin(dt * (1.2 + s.tw*70) + s.ph)*0.32;
        const a = Math.max(0.18, Math.min(1, twinkle));
        ctx.beginPath();
        ctx.arc(px, py, s.r*(0.85 + twinkle*0.35), 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        // glow for bright stars
        if(s.r>1.0 && a>0.82){
          ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(167,139,250,0.9)';
        } else { ctx.shadowBlur = 0; }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // shooting star occasional
      if(Math.random() < 0.0012){
        const sx = Math.random()*w*0.7;
        const sy = Math.random()*h*0.35;
        const len = 70 + Math.random()*90;
        const grad = ctx.createLinearGradient(sx, sy, sx+len, sy+len*0.35);
        grad.addColorStop(0,'rgba(255,255,255,0)');
        grad.addColorStop(0.45,'rgba(255,255,255,0.95)');
        grad.addColorStop(1,'rgba(255,255,255,0)');
        ctx.strokeStyle = grad as any;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx+len, sy+len*0.35); ctx.stroke();
      }

      // vignette
      const vig = ctx.createRadialGradient(w*0.52, h*0.45, h*0.3, w*0.52, h*0.45, w*0.9);
      vig.addColorStop(0,'rgba(0,0,0,0)');
      vig.addColorStop(1,'rgba(0,0,0,0.42)');
      ctx.fillStyle = vig; ctx.fillRect(0,0,w,h);

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove as any);
    window.addEventListener('touchmove', onMove as any, {passive:true});
    raf = requestAnimationFrame(tick);
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('touchmove', onMove as any);
    };
  },[reduced]);

  return (
    <>
      <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden />
      {/* Fallback static galaxy for reduced-motion */}
      {reduced && <div className="fixed inset-0 -z-10 bg-[#0a0a1e]" style={{background:'radial-gradient(1200px 600px at 70% 10%, rgba(124,58,237,0.22), transparent 60%), linear-gradient(180deg,#0a0a1e 0%,#13102e 55%,#070712 100%)'}} aria-hidden />}
      {/* Interactive hint */}
      <div className="fixed bottom-20 right-3 z-20 hidden md:block pointer-events-none">
        <div className="bg-white/10 backdrop-blur border border-white/10 px-2.5 py-1 rounded-full text-[11px] text-white/70">✦ Move cursor to parallax galaxy</div>
      </div>
    </>
  );
}
