'use client';
import { useState, useEffect } from 'react';
import { API } from '../lib/api';

export default function WhereApiUrl(){
  const [api,setApi]=useState<string>(API);
  const [input,setInput]=useState<string>(API);
  const [envInfo,setEnvInfo]=useState<any>(null);
  const [msg,setMsg]=useState<string>("");
  const envBuild = (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL as string) : "") || "";
  const isOverride = typeof window !== 'undefined' ? !!window.localStorage.getItem('NEXT_PUBLIC_API_URL') : false;
  const isLocalhost = api.includes('localhost') || api.includes('127.0.0.1');

  useEffect(()=>{
    fetch(`${API}/api/health`).then(r=>r.json()).then(j=>setEnvInfo(j)).catch(()=>setEnvInfo({status:'offline'}));
  },[]);

  const save = ()=>{
    const v = input.trim().replace(/\/+$/,'');
    if(!v.startsWith('http://') && !v.startsWith('https://')){
      setMsg('⚠ URL must start with https:// or http:// (e.g. https://your-backend.railway.app)');
      return;
    }
    try{
      localStorage.setItem('NEXT_PUBLIC_API_URL', v);
      setMsg('✓ Saved! Reloading to connect to '+v+' ...');
      setTimeout(()=> location.reload(), 700);
    }catch(e:any){ setMsg('Save failed: '+e.message); }
  };
  const reset = ()=>{
    localStorage.removeItem('NEXT_PUBLIC_API_URL');
    setMsg('✓ Override cleared — will use build env. Reloading...');
    setTimeout(()=> location.reload(), 700);
  };

  return (
    <div className="card border-violet-500/20 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${envInfo?.status==="ok" ? "bg-emerald-500 animate-pulse" : envInfo ? "bg-amber-500" : "bg-zinc-600 animate-pulse"}`} />
        <h3 className="font-bold text-sm">🌌 NEXT_PUBLIC_API_URL — Where the web talks to AI</h3>
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">
        This is the <b>only</b> connection between your PWA (Vercel on phone/PC) and your studio (FastAPI + Whisper + FFmpeg). Change it here, the whole app follows <b>without</b> touching Vercel settings.
      </p>

      {/* Interactive fill — answers your screenshot question */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-3">
        <div className="text-xs font-bold text-zinc-200">📝 Fill your backend URL here (works on phone):</div>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="https://your-backend.railway.app  or  https://xxx-8000.app.github.dev"
          className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-3 text-sm font-mono placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={save} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-full text-sm font-bold active:scale-95 transition">Save & Connect ✓</button>
          <button onClick={reset} className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-full text-sm">Reset</button>
          <span className="text-[11px] text-zinc-500 self-center">Saves to <code className="bg-zinc-800 px-1 rounded">localStorage</code> → reload. No rebuild.</span>
        </div>
        {msg && <div className={`text-xs rounded-xl px-3 py-2 border ${msg.startsWith('✓')?'bg-emerald-500/10 border-emerald-500/30 text-emerald-300':'bg-amber-500/10 border-amber-500/30 text-amber-200'}`}>{msg}</div>}
        {isLocalhost && (
          <div className="text-xs bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 leading-relaxed">
            ⚠ Your current URL is <b>localhost</b> — it only works on your PC. On Vercel ( {-isOverride ? 'phone/PC internet' : 'build env'} ) it will always say <b>Backend not reachable</b>. Paste your <b>Railway / Render / Codespaces 8000 forwarded URL</b> above and Save.
            <br/><span className="text-zinc-500">No backend yet? Deploy backend first (see table below) or keep this for later — frontend alone still shows the galaxy & UI.</span>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2">
        <div className="text-xs font-bold text-zinc-300">Current live value (what this browser uses now):</div>
        <div className="font-mono text-xs bg-black/40 border border-zinc-800 rounded-xl px-3 py-2.5 break-all select-all">{api} {isOverride && <span className="text-violet-400">(override)</span>} {!isOverride && envBuild && <span className="text-zinc-500">(from build env)</span>}</div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-bold ${envInfo?.status==="ok" ? "bg-emerald-500 text-white" : "bg-amber-500 text-black"}`}>{envInfo?.status==="ok" ? "● Backend online" : envInfo ? "● Backend not reachable" : "… checking"}</span>
          <span className="text-zinc-500">{envInfo?.whisper||""} {envInfo?.gpu?`• GPU ${envInfo.gpu}`:""}</span>
          {!envInfo && <span className="text-zinc-600">Probing {api}/api/health …</span>}
        </div>
        {isOverride && <div className="text-[11px] text-violet-300">Using localStorage override — change it above or hit Reset to use Vercel env. Tip: also set Vercel → Environment Variables for other devices.</div>}
        {!isOverride && envBuild && <div className="text-[11px] text-zinc-500">Build env: <code className="bg-zinc-800 px-1 rounded">{envBuild}</code> — change permanently in Vercel dashboard → Redeploy.</div>}
      </div>

      <div className="overflow-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-xs">
          <thead className="bg-zinc-900/80">
            <tr className="text-left text-zinc-400">
              <th className="p-2.5 font-semibold">Where you deploy</th>
              <th className="p-2.5 font-semibold">Where to store NEXT_PUBLIC_API_URL (permanent)</th>
              <th className="p-2.5 font-semibold">Quick phone trick</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            <tr><td className="p-2.5 font-semibold">Vercel (frontend)</td><td className="p-2.5">Vercel → Project → Settings → Environment Variables → add <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL</code> → Redeploy</td><td className="p-2.5">Use the <b>input above</b> on your vercel.app — instant, no Redeploy</td></tr>
            <tr><td className="p-2.5 font-semibold">Netlify (frontend)</td><td className="p-2.5">Netlify → Site settings → Environment variables</td><td className="p-2.5">Same input above</td></tr>
            <tr><td className="p-2.5 font-semibold">Docker localhost</td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">frontend/.env.local</code> + <code className="bg-zinc-800 px-1 rounded">docker-compose.yml</code></td><td className="p-2.5"><code className="bg-zinc-800 px-1 rounded">echo "NEXT_PUBLIC_API_URL=..." &gt; frontend/.env.local</code></td></tr>
            <tr><td className="p-2.5 font-semibold">No backend yet?</td><td className="p-2.5">Railway.app → New → Deploy from GitHub → add Redis+Postgres → copy URL as value</td><td className="p-2.5">Paste that URL above → Save</td></tr>
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-zinc-600 leading-relaxed">
        <b>Behind:</b> <code className="bg-zinc-800 px-1 rounded">frontend/lib/api.ts</code> reads <code className="bg-zinc-800 px-1 rounded">process.env.NEXT_PUBLIC_API_URL</code> at build then checks <code className="bg-zinc-800 px-1 rounded">localStorage</code> — every <code className="bg-zinc-800 px-1 rounded">fetch(API+"/api/...")</code> uses it. The input above just writes that localStorage key and reloads.
      </div>
    </div>
  );
}
