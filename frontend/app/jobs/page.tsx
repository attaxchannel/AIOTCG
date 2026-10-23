'use client';
import { useEffect, useState } from 'react';
import { listJobs, API } from '../../lib/api';

export default function JobsPage(){
  const [jobs,setJobs]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    listJobs().then(j=>{setJobs(j); setLoading(false)}).catch(()=>setLoading(false));
    const t=setInterval(()=>listJobs().then(setJobs).catch(()=>{}),3000);
    return ()=>clearInterval(t);
  },[]);
  if(loading) return <div className="card">Loading projects...</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Projects</h1>
      {jobs.length===0 && <div className="card text-sm text-zinc-400">No jobs yet. Upload from home.</div>}
      {jobs.map(j=>(
        <div key={j.id} className="card space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs">{j.id.slice(0,8)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${j.status==="done"?"bg-green-600":j.status==="failed"?"bg-red-600":"bg-zinc-700"}`}>{j.status} {j.progress?`${j.progress}%`:""}</span>
          </div>
          <div className="text-xs text-zinc-400">{new Date(j.created_at).toLocaleString()}</div>
          {j.clips && <div className="text-xs text-zinc-300">{j.clips.length} clips • {j.clips[0]?.title||""}</div>}
          {j.outputs && j.outputs.length>0 && (
            <div className="flex flex-wrap gap-2">
              {j.outputs.map((o:any,i:number)=>(
                <a key={i} href={`${API}/outputs/${o.path.split("/").pop()}`} target="_blank" className="text-xs bg-white text-black px-3 py-1 rounded-full">{o.ratio} clip {o.clip_index+1}</a>
              ))}
            </div>
          )}
          <a href={`/?job=${j.id}`} className="text-xs text-violet-400">Open →</a>
        </div>
      ))}
    </div>
  );
}
