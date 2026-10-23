'use client';
import { useEffect, useState } from 'react';
import { API } from '../../lib/api';

export default function EditorPage(){
  const [jobId,setJobId]=useState("");
  const [job,setJob]=useState<any>(null);
  const [clips,setClips]=useState<any[]>([{start:0,end:30}]);
  const [ratios,setRatios]=useState<string[]>(["9:16"]);

  const load = async()=>{
    if(!jobId) return;
    const j = await fetch(`${API}/api/jobs/${jobId}`).then(r=>r.json());
    setJob(j);
    if(j.clips?.length) setClips(j.clips.map((c:any)=>({start:c.start,end:c.end})));
    if(j.transcript?.segments) {
      // transcript available
    }
  };

  const rerender = async()=>{
    const res = await fetch(`${API}/api/jobs/${jobId}/rerender`,{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({clips, ratios})}).then(r=>r.json());
    alert("Rerender job: "+res.job_id);
    window.location.href="/jobs";
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Manual Editor (Timeline)</h1>
      <div className="card space-y-3">
        <input placeholder="Paste job_id (from Projects)" value={jobId} onChange={e=>setJobId(e.target.value)} className="w-full bg-zinc-800 rounded-xl px-3 py-2 text-sm font-mono" />
        <button onClick={load} className="btn w-full">Load Job + Transcript</button>
        {job?.transcript && (
          <div className="bg-zinc-800 rounded-xl p-3 max-h-48 overflow-auto text-xs">
            <div className="font-medium mb-1">Transcript ({job.transcript.language}): tap a word to set start</div>
            {job.transcript.segments?.slice(0,20).map((s:any,i:number)=>(
              <span key={i} onClick={()=>setClips([{start:s.start,end:s.end}, ...clips.slice(1)])} className="mr-1 leading-6 cursor-pointer hover:bg-violet-600 px-1 rounded">
                {s.text}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card space-y-3">
        <h3 className="font-medium">Clips (manual cuts)</h3>
        {clips.map((c,i)=>(
          <div key={i} className="flex gap-2 items-center">
            <input type="number" step="0.1" value={c.start} onChange={e=>setClips(clips.map((x,idx)=>idx===i?{...x,start:parseFloat(e.target.value)||0}:x))} className="bg-zinc-800 rounded-lg px-2 py-2 w-24 text-sm" placeholder="start" />
            <span className="text-zinc-500">→</span>
            <input type="number" step="0.1" value={c.end} onChange={e=>setClips(clips.map((x,idx)=>idx===i?{...x,end:parseFloat(e.target.value)||0}:x))} className="bg-zinc-800 rounded-lg px-2 py-2 w-24 text-sm" placeholder="end" />
            <span className="text-xs text-zinc-500">{(c.end-c.start).toFixed(1)}s</span>
            <button onClick={()=>setClips(clips.filter((_,idx)=>idx!==i))} className="text-red-400 text-sm">✕</button>
          </div>
        ))}
        <button onClick={()=>setClips([...clips,{start:0,end:30}])} className="text-sm bg-zinc-800 px-3 py-2 rounded-full">+ Add Clip</button>

        <div className="flex flex-wrap gap-2 pt-2">
          {["9:16","16:9","1:1","4:5"].map(r=>(
            <button key={r} onClick={()=>setRatios(ratios.includes(r)?ratios.filter(x=>x!==r):[...ratios,r])} className={`px-3 py-1.5 rounded-full text-xs border ${ratios.includes(r)?"bg-violet-600 border-violet-500":"bg-zinc-800 border-zinc-700"}`}>{r}</button>
          ))}
        </div>

        <button onClick={rerender} className="btn w-full">🎬 Rerender Selected Ratios</button>
        <p className="text-xs text-zinc-500">Uses same FFmpeg + ASS pipeline. Drag values to adjust cuts 0.1s precise. Add B-roll via Pexels API in Phase 4.</p>
      </div>
    </div>
  );
}
