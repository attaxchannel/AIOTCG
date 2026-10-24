'use client';
import { useState } from 'react';
import { getAPI } from '../../lib/api';

export default function EditorPage(){
  const [jobId,setJobId]=useState("");
  const [job,setJob]=useState<any>(null);
  const [clipIdx,setClipIdx]=useState(0);
  const [msg,setMsg]=useState("");

  const load = async()=>{
    if(!jobId.trim()) return;
    setMsg("Loading…");
    try{
      const j=await fetch(`${getAPI()}/api/jobs/${jobId.trim()}`).then(r=>r.json());
      if((j as any).error || (j as any).detail) { setMsg(JSON.stringify(j).slice(0,200)); return; }
      setJob(j);
      setMsg("");
    }catch(e:any){ setMsg(e.message); }
  };

  const rerender = async()=>{
    const clip = job?.clips?.[clipIdx];
    if(!clip || !job) return;
    setMsg("Queueing rerender…");
    try{
      const r=await fetch(`${getAPI()}/api/jobs/${job.id}/rerender`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({clips: [{start: clip.start, end: clip.end}], ratios: ["9:16"]})});
      const j=await r.json();
      setMsg(j.job_id ? `Rerender queued ✓ — new job ${String(j.job_id).slice(0,8)} — open Projects` : JSON.stringify(j).slice(0,300));
    }catch(e:any){ setMsg(e.message); }
  };

  // waveform helper: map transcript waveform peaks to timeline bar
  const Wave = ({job, clip}: {job:any, clip:any}) => {
    const wf = job?.transcript?.waveform?.peaks as number[] | undefined;
    const dur = job?.transcript?.duration || job?.transcript?.waveform?.duration || 60;
    if(!wf || !clip) return null;
    const s = Math.max(0, clip.start), e = Math.min(dur, clip.end);
    const bars = wf.length;
    const i0 = Math.max(0, Math.floor(s/dur*bars));
    const i1 = Math.min(bars, Math.ceil(e/dur*bars));
    const slice = wf.slice(i0, i1);
    if(slice.length===0) return null;
    return (
      <div className="flex gap-[2px] items-end h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 overflow-hidden">
        {slice.map((v,i)=>(
          <div key={i} className="flex-1 min-w-[2px] bg-violet-500/90 rounded-full" style={{height: `${Math.max(12, v*100)}%`, opacity: 0.7 + v*0.3}} />
        ))}
        <span className="ml-2 text-[10px] text-zinc-600 font-mono self-center">{s.toFixed(1)}–{e.toFixed(1)}s • {bars} bars server-peaks</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="card">
        <h1 className="font-black text-[17px] tracking-tight">Editor — Precision Timeline</h1>
        <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Tap transcript word to set cut, tweak 0.1 s, rerender. One-thumb controls — server re-exports.</p>
        <div className="flex gap-2 mt-4">
          <input value={jobId} onChange={e=>setJobId(e.target.value)} placeholder="Paste Job ID from Projects" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-3 text-sm focus:border-zinc-600 focus:outline-none" />
          <button onClick={load} className="btn px-6">Load</button>
        </div>
        {msg && <div className="text-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mt-3 leading-relaxed">{msg}</div>}
        <div className="text-[11px] text-zinc-600 mt-2">Tip: Copy Job ID from Projects → tap clip → edit start/end → Rerender.</div>
      </div>

      {job && (
        <>
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold tracking-tight">Job {job.id.slice(0,8)} • {job.clips?.length||0} clips</div>
              <span className="text-xs bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full font-medium">{job.status}</span>
            </div>
            <div className="flex gap-2 mt-3 overflow-auto pb-2">
              {(job.clips||[]).map((c:any,i:number)=>(
                <button key={i} onClick={()=>setClipIdx(i)} className={`px-4 py-2.5 rounded-full text-sm font-semibold shrink-0 border ${i===clipIdx?"bg-white border-white text-black":"bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600"}`}>
                  #{i+1} {(c.end-c.start).toFixed(1)}s • {c.score}/10
                </button>
              ))}
            </div>
            {job.clips?.[clipIdx] && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mt-3 space-y-3">
                <div className="font-bold text-sm tracking-tight">{job.clips[clipIdx].title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{job.clips[clipIdx].reason}</div>
                <div className="text-xs text-violet-400 italic">"{job.clips[clipIdx].hook_text||""}"</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 font-medium">Start (s)</label>
                    <input type="number" step="0.1" value={job.clips[clipIdx].start} onChange={e=>{ const v=[...job.clips]; v[clipIdx]={...v[clipIdx], start: parseFloat(e.target.value)||0}; setJob({...job, clips:v}); }} className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 font-medium">End (s)</label>
                    <input type="number" step="0.1" value={job.clips[clipIdx].end} onChange={e=>{ const v=[...job.clips]; v[clipIdx]={...v[clipIdx], end: parseFloat(e.target.value)||0}; setJob({...job, clips: v}); }} className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Duration: {(job.clips[clipIdx].end - job.clips[clipIdx].start).toFixed(1)}s • ideal 25–58 s</span>
                  <button onClick={()=>{ const v=[...job.clips]; const mid=(v[clipIdx].start+v[clipIdx].end)/2; v[clipIdx].start=Math.max(0,mid-15); v[clipIdx].end=mid+15; setJob({...job, clips:v}); }} className="text-violet-400 font-medium">Reset 30 s</button>
                </div>
                <Wave job={job} clip={job.clips[clipIdx]} />
                {job.segments && (
                  <>
                    <div className="text-xs font-semibold text-zinc-300">Tap word to set start</div>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto p-1">
                      {job.segments.slice(0,80).map((s:any,i:number)=>(
                        <button key={i} onClick={()=>{ const v=[...job.clips]; v[clipIdx].start=s.start; v[clipIdx].end=Math.min((job.duration||s.start+30), s.start+30); setJob({...job, clips:v}); }} className="text-xs bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 px-2.5 py-1.5 rounded-full transition text-left">
                          {s.text?.slice(0,28)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <button onClick={rerender} className="btn w-full text-sm">Rerender Clip #{clipIdx+1} — 9:16 →</button>
              </div>
            )}
          </div>

          {job.outputs?.length>0 && (
            <div className="card">
              <div className="font-bold text-sm tracking-tight mb-2">Outputs</div>
              {job.outputs.map((o:any,i:number)=>(
                <a key={i} href={`${getAPI()}/outputs/${o.path.split("/").pop()}`} target="_blank" className="flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-3 mt-2 hover:border-zinc-700 transition">
                  <span className="text-sm font-medium">{o.ratio} • Clip #{o.clip_index+1} • {o.start?.toFixed(1)}–{o.end?.toFixed(1)}s</span>
                  <span className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold">▶ Play</span>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {!job && (
        <div className="text-center text-xs text-zinc-600">Load a job to edit. Jobs are created in Studio.</div>
      )}
    </div>
  );
}
