'use client';
import { useEffect, useState } from 'react';
import { getAPI } from '../../../lib/api';
export default function JobDetail({ params }: { params: { id: string } }){
  const [job,setJob]=useState<any>(null);
  useEffect(()=>{
    let t: any;
    const load=()=>fetch(`${getAPI()}/api/jobs/${params.id}`).then(r=>r.json()).then(j=>{ setJob(j); if(j.status==="done"||j.status==="failed") clearInterval(t); }).catch(()=>{});
    load();
    t=setInterval(load, 2500);
    let ws: WebSocket | null = null;
    try{
      ws=new WebSocket(`${getAPI().replace(/^http/,"ws")}/ws/jobs/${params.id}`);
      ws.onmessage=(ev)=>{ try{ const d=JSON.parse(ev.data); setJob(d); if(d.status==="done"||d.status==="failed"){ clearInterval(t); try{ ws?.close(); }catch{} } }catch{} };
      ws.onerror=()=>{};
    }catch{}
    return ()=>{ clearInterval(t); try{ ws?.close(); }catch{} };
  },[params.id]);
  if(!job) return <div className="card">Loading {params.id.slice(0,8)}…</div>;
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <a href="/jobs" className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center">‹</a>
        <h1 className="font-bold flex-1 truncate tracking-tight">Job {job.id.slice(0,8)} • {job.status} • {job.progress}%</h1>
        <a href="/editor" className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full font-medium">Edit</a>
      </div>
      <div className="card">
        <div className="flex items-center justify-between"><span className="text-sm font-semibold">Progress</span><span className="mono bg-zinc-800 px-2 py-1 rounded-full text-xs">{job.status}</span></div>
        <div className="w-full bg-zinc-800 rounded-full h-2 mt-3 overflow-hidden border border-zinc-700/40"><div className="bg-white h-2 transition-all" style={{width: `${job.progress||0}%`}} /></div>
        {job.error && <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300">{job.error}</div>}
      </div>
      {job.clips && job.clips.length>0 && (
        <div className="card bg-zinc-950">
          <div className="text-xs font-bold text-zinc-300">{job.clips.length} viral moments — ranked</div>
          {job.clips.map((c:any,i:number)=>(
            <div key={i} className="flex gap-2 text-xs py-2 border-b border-zinc-800 last:border-0">
              <span className="bg-white text-black w-6 h-6 rounded-full grid place-items-center font-bold shrink-0 text-[11px]">{i+1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-200">{c.title} <span className="text-zinc-500">{c.score}/10</span></div>
                <div className="text-zinc-500">{c.start?.toFixed(1)}s – {c.end?.toFixed(1)}s • {c.reason?.slice(0,120)}</div>
                <div className="text-zinc-600 italic truncate">"{(c.hook_text||"").slice(0,80)}"</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {job.outputs?.length>0 ? (
        <div className="grid gap-3">
          {job.outputs.map((o:any,i:number)=>(
            <div key={i} className="card flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm tracking-tight">{o.ratio} • Clip {o.clip_index+1}</div>
                <div className="text-xs text-zinc-500">{o.start?.toFixed(1)}s – {o.end?.toFixed(1)}s • {o.title||job.clips?.[o.clip_index]?.title||"Ready"}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a href={`${getAPI()}/outputs/${o.path.split("/").pop()}`} target="_blank" className="bg-white text-black px-4 py-2.5 rounded-full text-sm font-bold">▶ Play</a>
                <a href={`${getAPI()}/outputs/${o.path.split("/").pop()}`} download className="bg-zinc-800 border border-zinc-700 w-10 h-10 grid place-items-center rounded-full">⤓</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center text-sm text-zinc-500 py-8">{job.status==="done"?"No outputs — check server logs":job.status==="failed"?"Failed — see error above":"Rendering… keep app open or wait for push"}</div>
      )}
      <div className="flex gap-2">
        <a href="/editor" className="btn-ghost text-sm">Open Editor</a>
        <button onClick={async()=>{ if(!confirm("Delete job?")) return; await fetch(`${getAPI()}/api/jobs/${params.id}`,{method:"DELETE"}); location.href="/jobs"; }} className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full">Delete</button>
      </div>
    </div>
  );
}
