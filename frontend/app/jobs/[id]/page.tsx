'use client';
import { useEffect, useState } from 'react';
import { API } from '../../../lib/api';
export default function JobDetail({ params }: { params: { id: string } }){
  const [job,setJob]=useState<any>(null);
  useEffect(()=>{
    fetch(`${API}/api/jobs/${params.id}`).then(r=>r.json()).then(setJob);
    const t=setInterval(()=>fetch(`${API}/api/jobs/${params.id}`).then(r=>r.json()).then(setJob),2000);
    return ()=>clearInterval(t);
  },[params.id]);
  if(!job) return <div className="card">Loading...</div>;
  return (
    <div className="space-y-4">
      <h1 className="font-bold">Job {job.id.slice(0,8)}</h1>
      <div className="card">
        <div className="text-sm">Status: <span className="font-mono">{job.status}</span> • {job.progress}%</div>
        {job.outputs?.map((o:any,i:number)=>(<a key={i} href={`${API}/outputs/${o.path.split("/").pop()}`} target="_blank" className="block mt-2 text-sm bg-white text-black px-3 py-2 rounded-full text-center">Download {o.ratio}</a>))}
      </div>
    </div>
  );
}
