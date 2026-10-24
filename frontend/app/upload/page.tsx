'use client';
import { useEffect, useState } from 'react';
import { getAPI } from '../../lib/api';
export default function UploadPage(){
  const [shared,setShared]=useState("");
  const [url,setUrl]=useState("");
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");
  useEffect(()=>{
    const q=new URLSearchParams(window.location.search);
    const u=q.get("url")||"";
    const t=q.get("title")||q.get("text")||"";
    const got = u || t;
    if(got) { setShared(got); setUrl(got.match(/https?:\/\/[^\s]+/)?.[0] || u || got); }
  },[]);
  const ingest = async()=>{
    const u = url.trim();
    if(!u) return setMsg("Paste a URL first");
    setBusy(true); setMsg("Sending to studio…");
    try{
      const r = await fetch(`${getAPI()}/api/upload-url?url=${encodeURIComponent(u)}&mode=auto&ratios=9:16`, {method:"POST"});
      const j = await r.json().catch(()=>({}));
      if(!r.ok) throw new Error((j as any).detail || JSON.stringify(j).slice(0,300) || "failed");
      setMsg("✓ Queued — "+(j.job_id||"")+" — opening project…");
      setTimeout(()=> location.href = j.job_id ? `/jobs/${j.job_id}` : "/jobs", 700);
    }catch(e:any){ setMsg("✗ "+e.message.slice(0,400)); }
    finally{ setBusy(false); }
  };
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="card">
        <h1 className="font-bold tracking-tight">📤 Share Target</h1>
        <p className="text-sm text-zinc-500 mt-1">Shared from YouTube / TikTok / other app — send directly to studio via <code className="bg-zinc-800 px-1 rounded">yt-dlp</code>.</p>
        {shared ? (
          <div className="space-y-3 mt-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-sm break-all">{shared}</div>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…  or direct .mp4" className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:border-violet-500 focus:outline-none" />
            <button onClick={ingest} disabled={busy} className="btn w-full disabled:opacity-50">{busy?"Queueing…":"Send to Studio — Auto Clip →"}</button>
            {msg && <div className="text-xs bg-zinc-900 border border-zinc-800 rounded-xl p-3 leading-relaxed">{msg}</div>}
            <div className="text-[11px] text-zinc-500"><a href="/" className="text-violet-400">Or open Studio file picker →</a> • Phone = remote, server renders • Needs backend online</div>
          </div>
        ) : (
          <div className="text-sm text-zinc-600 mt-3">No shared content in URL. Go to <a href="/" className="text-violet-400">Studio → File or URL tab</a> to create, or Share from YouTube → choose AIOTCG.</div>
        )}
      </div>
      <div className="card bg-zinc-900/50 text-xs leading-relaxed">
        <b>Phone tip:</b> Add to Home Screen, then Share from YouTube → <b>AIOTCG</b> → this page appears → <b>Send to Studio</b>. Server runs <code className="bg-zinc-800 px-1 rounded">yt-dlp</code> (no phone download). Also available as <code className="bg-zinc-800 px-1 rounded">POST /api/upload-url?url=…</code>
      </div>
    </div>
  );
}
