'use client';
import { useEffect, useState } from 'react';
import { getAPI } from '../../lib/api';

export default function JobsPage(){
  const [jobs,setJobs]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const load = async()=>{
    try{
      const j = await fetch(`${getAPI()}/api/jobs`).then(r=>r.json());
      const arr = Array.isArray(j)?j:(j.jobs||j||[]);
      setJobs(arr);
    }catch(e){ console.error(e); }
    setLoading(false);
  };
  useEffect(()=>{ load(); const t=setInterval(load,2500); return ()=>clearInterval(t); },[]);
  if(loading) return <div className="card animate-pulse"><div className="h-5 bg-zinc-800 rounded w-32"/><div className="h-3 bg-zinc-800 rounded w-48 mt-2"/></div>;
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-black text-[18px] tracking-tight">Projects</h1>
          <p className="text-xs text-zinc-500">Tap to play or edit. Auto-refresh every 2.5 s.</p>
        </div>
        <span className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full font-medium">{jobs.length} jobs</span>
      </div>
      {jobs.length===0 ? (
        <div className="card text-center py-12">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 grid place-items-center font-black">▶</div>
          <div className="font-bold mt-3 tracking-tight">Studio is empty</div>
          <div className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">Create in Studio. AI finds viral moments — you keep the phone, server renders.</div>
          <a href="/" className="btn inline-block mt-5">Open Studio →</a>
          <div className="text-xs text-zinc-600 mt-4">Tip: Share from YouTube → choose AIOTCG</div>
        </div>
      ) : jobs.map((j:any)=>(
        <a key={j.id} href={`/jobs/${j.id}`} className="card flex gap-4 hover:border-zinc-700 active:scale-[0.99] transition">
          <div className="w-12 h-12 rounded-2xl bg-white text-black grid place-items-center font-black shrink-0">▶</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">Job {j.id.slice(0,8)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${j.status==="done"?"bg-emerald-500 text-white":j.status==="failed"?"bg-red-500 text-white":"bg-zinc-800 border border-zinc-700 text-zinc-300"}`}>{j.status} {j.progress?`${j.progress}%`:""}</span>
            </div>
            <div className="text-xs text-zinc-500 truncate mt-0.5">{j.clips?.length||0} clips • {j.ratios?.join(", ")||"9:16"} • {j.created_at ? new Date(j.created_at).toLocaleString() : ""}</div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden border border-zinc-700/30"><div className="bg-white h-1.5 transition-all" style={{width: `${j.progress||5}%`}} /></div>
          </div>
          <span className="text-zinc-500 text-xl shrink-0 self-center">›</span>
        </a>
      ))}
    </div>
  );
}
