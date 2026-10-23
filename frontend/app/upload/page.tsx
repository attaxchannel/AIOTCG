'use client';
import { useEffect } from 'react';
export default function UploadPage(){
  useEffect(()=>{ window.location.href="/"; },[]);
  return <div className="card">Redirecting to Generate...</div>;
}
