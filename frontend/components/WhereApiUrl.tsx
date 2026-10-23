'use client';
import { useState, useEffect } from 'react';
import { API } from '../lib/api';

export default function WhereApiUrl(){
  const [api,setApi]=useState<string>(API);
  const [envInfo,setEnvInfo]=useState<any>(null);
  useEffect(()=>{
    // Probe backend health to show live status
    fetch(`${API}/api/health`).then(r=>r.json()).then(j=>setEnvInfo(j)).catch(()=>setEnvInfo({status:'offline'}));
  },[]);
  return (
    <div className="card border-violet-500/20 space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${envInfo?.status==="ok" ? "bg-emerald-500 animate-pulse" : envInfo ? "bg-amber-500" : "bg-zinc-600 animate-pulse"}`} />
        <h3 className="font-bold text-sm">🌌 NEXT_PUBLIC_API_URL — Where the web talks to AI</h3>
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">
        This is the <b>only</b> connection between your PWA (Vercel/Netlify/phone/PC Chrome) and your heavy studio (FastAPI + Whisper + FFmpeg). Change it once, the whole app follows.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2">
        <div className="text-xs font-bold text-zinc-300">Current live value (what this browser is using right now):</div>
        <div className="font-mono text-xs bg-black/40 border border-zinc-800 rounded-xl px-3 py-2.5 break-all select-all">{api}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-bold ${envInfo?.status==="ok" ? "bg-emerald-500 text-white" : "bg-amber-500 text-black"}`}>{envInfo?.status==="ok" ? "● Backend online" : envInfo ? "● Backend not reachable" : "… checking"}</span>
          <span className="text-zinc-500">{envInfo?.whisper||""} {envInfo?.gpu?`• GPU ${envInfo.gpu}`:""}</span>
        </div>
        <div className="text-[11px] text-zinc-500">If it says offline, your <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL</code> points to a backend that isn't running. See storage table below where to fix it.</div>
      </div>

      <div className="overflow-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-xs">
          <thead className="bg-zinc-900/80">
            <tr className="text-left text-zinc-400">
              <th className="p-2.5 font-semibold">Where you deploy</th>
              <th className="p-2.5 font-semibold">Where to store NEXT_PUBLIC_API_URL</th>
              <th className="p-2.5 font-semibold">How to change interactively</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            <tr><td className="p-2.5 font-semibold">Vercel (frontend)</td><td className="p-2.5">Vercel → Project → Settings → Environment Variables → add <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL</code> → Redeploy</td><td className="p-2.5">Edit there, push Redeploy — PWA instantly uses new backend. No code change.</td></tr>
            <tr><td className="p-2.5 font-semibold">Netlify (frontend)</td><td className="p-2.5">Netlify → Site settings → Environment variables → <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL</code> → Trigger deploy</td><td className="p-2.5">Same — live reload after deploy.</td></tr>
            <tr><td className="p-2.5 font-semibold">Docker Compose (self-host localhost)</td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">docker-compose.yml</code> → <code className="bg-zinc-800 px-1 rounded">frontend.environment.NEXT_PUBLIC_API_URL</code> + <code className="bg-zinc-800 px-1 rounded">frontend/.env.local</code></td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">echo "NEXT_PUBLIC_API_URL=http://localhost:8000" &gt; frontend/.env.local</code> then <code className="bg-zinc-800 px-1 rounded">docker compose up -d --build frontend</code></td></tr>
            <tr><td className="p-2.5 font-semibold">PC Chrome no Docker (dev)</td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">frontend/.env.local</code> file</td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev</code></td></tr>
            <tr><td className="p-2.5 font-semibold">Phone Chrome (Termux)</td><td className="p-2.5">Same <code className="bg-zinc-800 px-1 rounded">frontend/.env.local</code> or inline env</td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL=https://your-railway.app npm run dev</code> then Chrome <code className="bg-zinc-800 px-1 rounded">http://localhost:3000</code></td></tr>
            <tr><td className="p-2.5 font-semibold">GitHub Codespaces</td><td className="p-2.5">Codespaces → Ports → forward 3000 env</td><td className="p-2.5">Set <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL</code> to forwarded <code className="bg-zinc-800 px-1 rounded">https://xxx-8000.app.github.dev</code></td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs leading-relaxed">
        <b>Interactive trick — change without redeploy (phone):</b> Open browser console on <code className="bg-zinc-800 px-1 rounded">your vercel.app</code> → <code className="bg-zinc-800 px-1 rounded">localStorage.setItem('NEXT_PUBLIC_API_URL','https://new-backend.com'); location.reload()</code> — if you add this override in <code className="bg-zinc-800 px-1 rounded">lib/api.ts</code> (optional helper below). Or just change env in Vercel settings — takes 30s.
      </div>

      <div className="text-[11px] text-zinc-600 leading-relaxed">
        <b>Behind the scenes:</b> <code className="bg-zinc-800 px-1 rounded">frontend/lib/api.ts</code> reads <code className="bg-zinc-800 px-1 rounded">process.env.NEXT_PUBLIC_API_URL</code> at build time (Next.js inlines it) → every <code className="bg-zinc-800 px-1 rounded">fetch(API + "/api/...")</code> and <code className="bg-zinc-800 px-1 rounded">new WebSocket(wsUrl)</code> uses it. The backend is just FastAPI on <code className="bg-zinc-800 px-1 rounded">:8000</code> — any host reachable from browser works.
      </div>
    </div>
  );
}
