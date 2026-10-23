'use client';
import { useEffect, useState } from 'react';
export default function UploadPage(){
  const [shared,setShared]=useState("");
  useEffect(()=>{
    const q=new URLSearchParams(window.location.search);
    const t=q.get("title")||q.get("text")||q.get("url")||"";
    if(t) setShared(t);
    // if shared, redirect to home with shared param? For now show message
  },[]);
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="card">
        <h1 className="font-bold">📤 Share Target</h1>
        <p className="text-sm text-zinc-500 mt-1">You shared from YouTube / other app. We got:</p>
        {shared ? <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-3 text-sm break-all">{shared}</div> : <div className="text-sm text-zinc-600 mt-3">No shared content. Go to Generate to upload video file directly. Share Target for files is handled by system — pick video file from Files app via Generate.</div>}
        <a href="/" className="btn inline-block mt-4">Go to Generate →</a>
      </div>
      <div className="card bg-zinc-900/50 text-xs leading-relaxed">
        <b>Phone tip:</b> On Android, Share from YouTube → if you shared a URL, paste that URL into a downloader, then upload the video file via Generate. Direct file share (video/*) needs native Share Target — enabled via manifest (works after Add to Home Screen).
      </div>
    </div>
  );
}
