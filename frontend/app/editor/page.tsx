'use client';
import { useState } from 'react';
import { API } from '../../lib/api';

export default function EditorPage(){
  const [jobId,setJobId]=useState("");
  const [job,setJob]=useState<any>(null);
  const [clipIdx,setClipIdx]=useState(0);
  const [msg,setMsg]=useState("");

  const load = async()=>{
    if(!jobId.trim()) return;
    setMsg("Loading...");
    try{
      const j=await fetch(`${API}/api/jobs/${jobId.trim()}`).then(r=>r.json());
      if((j as any).error || (j as any).detail) { setMsg(JSON.stringify(j).slice(0,200)); return; }
      setJob(j);
      setMsg(job ? "" : "");
    }catch(e:any){ setMsg(e.message); }
  };

  const rerender = async()=>{
    const clip = job?.clips?.[clipIdx];
    if(!clip || !job) return;
    setMsg("Rerendering this clip...");
    try{
      const r=await fetch(`${API}/api/jobs/${job.id}/rerender`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({clip_index:clipIdx, start: clip.start, end: clip.end, ratio:"9:16"})});
      const j=await r.json();
      setMsg(j.ok||j.job_id ? `Rerender queued ✓ — check Projects` : JSON.stringify(j).slice(0,300));
    }catch(e:any){ setMsg(e.message); }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="card">
        <h1 className="font-black text-lg" style={{fontFamily:'Plus Jakarta Sans'}}>✂️ Manual Editor</h1>
        <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Human-touch timeline — tap a word to jump, tweak 0.1s, rerender. Huge tap targets for one-thumb phone editing.</p>
        <div className="flex gap-2 mt-3">
          <input value={jobId} onChange={e=>setJobId(e.target.value)} placeholder="Paste Job ID from Projects" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
          <button onClick={load} className="btn px-6">Load</button>
        </div>
        {msg && <div className="text-xs bg-zinc-900 border border-zinc-800 rounded-xl p-3 mt-3">{msg}</div>}
        <div className="text-[11px] text-zinc-600 mt-2">Tip: Copy Job ID from Projects → tap clip chip → adjust start/end → Rerender.</div>
      </div>

      {job && (
        <>
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Job {job.id.slice(0,8)} • {job.clips?.length||0} clips</div>
              <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-full">{job.status}</span>
            </div>
            <div className="flex gap-2 mt-3 overflow-auto pb-2">
              {(job.clips||[]).map((c:any,i:number)=>(
                <button key={i} onClick={()=>setClipIdx(i)} className={`px-4 py-2.5 rounded-full text-sm font-semibold shrink-0 border ${i===clipIdx?"bg-violet-600 border-violet-500 text-white shadow-md":"bg-zinc-800 border-zinc-700 text-zinc-300"}`}>
                  #{i+1} {(c.end-c.start).toFixed(1)}s • {c.score}/10
                </button>
              ))}
            </div>
            {job.clips?.[clipIdx] && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mt-3 space-y-3">
                <div className="font-bold text-sm">{job.clips[clipIdx].title}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">{job.clips[clipIdx].reason}</div>
                <div className="text-xs text-violet-400 italic">"{job.clips[clipIdx].hook_text||""}"</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400">Start (s)</label>
                    <input type="number" step="0.1" value={job.clips[clipIdx].start} onChange={e=>{ const v=[...job.clips]; v[clipIdx]={...v[clipIdx], start: parseFloat(e.target.value)||0}; setJob({...job, clips:v}); }} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400">End (s)</label>
                    <input type="number" step="0.1" value={job.clips[clipIdx].end} onChange={e=>{ const v=[...job.clips]; v[clipIdx]={...v[clipIdx], end: parseFloat(e.target.value)||0}; setJob({...job, clips: v}); }} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Duration: {(job.clips[clipIdx].end - job.clips[clipIdx].start).toFixed(1)}s (ideal 25-58s)</span>
                  <button onClick={()=>{ const v=[...job.clips]; const mid=(v[clipIdx].start+v[clipIdx].end)/2; v[clipIdx].start=Math.max(0,mid-15); v[clipIdx].end=mid+15; setJob({...job, clips:v}); }} className="text-violet-400">Reset to 30s</button>
                </div>
                {job.segments && (
                  <>
                    <div className="text-xs font-semibold text-zinc-300">Tap a word to set start 👇</div>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto p-1">
                      {job.segments.slice(0,80).map((s:any,i:number)=>(
                        <button key={i} onClick={()=>{ const v=[...job.clips]; v[clipIdx].start=s.start; v[clipIdx].end=Math.min((job.duration||s.start+30), s.start+30); setJob({...job, clips:v}); }} className="text-xs bg-zinc-800 hover:bg-violet-600 border border-zinc-700 px-2.5 py-1.5 rounded-full active:bg-violet-600 transition text-left">
                          {s.text?.slice(0,28)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <button onClick={rerender} className="btn w-full text-sm">⚡ Rerender Clip #{clipIdx+1} in 9:16 →</button>
              </div>
            )}
          </div>

          {job.outputs?.length>0 && (
            <div className="card">
              <div className="font-bold text-sm mb-2">Current outputs</div>
              {job.outputs.map((o:any,i:number)=>(
                <a key={i} href={`${API}/outputs/${o.path.split("/").pop()}`} target="_blank" className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mt-2 hover:border-violet-500/30">
                  <span className="text-sm font-semibold">{o.ratio} • Clip #{o.clip_index+1} • {o.start?.toFixed(1)}–{o.end?.toFixed(1)}s</span>
                  <span className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold">▶ Play</span>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {!job && (
        <div className="text-center text-xs text-zinc-600">Load a job to edit. Jobs are created from Generate.</div>
      )}
    </div>
  );
}
