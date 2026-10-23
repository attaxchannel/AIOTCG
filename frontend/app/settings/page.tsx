'use client';
import { useEffect, useState } from 'react';
import { API } from '../../lib/api';

const PROVIDERS = [
  {id:"openai", label:"OpenAI", icon:"🤖", hint:"api.openai.com — gpt-4o-mini, gpt-4o", baseDefault:"https://api.openai.com/v1"},
  {id:"anthropic", label:"Anthropic Claude", icon:"🧠", hint:"api.anthropic.com — claude-3-5-sonnet", baseDefault:"https://api.anthropic.com"},
  {id:"groq", label:"Groq (Fast & Free)", icon:"⚡", hint:"api.groq.com — llama3-70b-8192", baseDefault:"https://api.groq.com/openai/v1"},
  {id:"deepseek", label:"DeepSeek", icon:"🌊", hint:"api.deepseek.com — deepseek-chat", baseDefault:"https://api.deepseek.com"},
  {id:"gemini", label:"Google Gemini", icon:"💎", hint:"generativelanguage.googleapis.com — gemini-1.5-flash", baseDefault:"https://generativelanguage.googleapis.com"},
  {id:"ollama", label:"Ollama (Local)", icon:"🦙", hint:"No key needed — runs on your server", baseDefault:"http://localhost:11434"},
  {id:"cline", label:"Cline (OAuth)", icon:"🔗", hint:"Connect Cline account — paste OAuth token", baseDefault:""},
  {id:"antigravity", label:"Antigravity (OAuth)", icon:"🛰️", hint:"Connect Antigravity — paste token", baseDefault:""},
];

export default function SettingsPage(){
  const [data,setData]=useState<any>(null);
  const [form,setForm]=useState<any>({});
  const [active,setActive]=useState("openai");
  const [model,setModel]=useState("gpt-4o-mini");
  const [msg,setMsg]=useState("");
  const [testing,setTesting]=useState(false);

  const load = async()=>{
    const j = await fetch(`${API}/api/settings`).then(r=>r.json());
    setData(j);
    setActive(j.active_llm_provider || "openai");
    setModel(j.active_llm_model || "gpt-4o-mini");
    setForm(j);
  };
  useEffect(()=>{ load(); },[]);

  const save = async()=>{
    setMsg("Saving...");
    const payload:any = {
      active_llm_provider: active,
      active_llm_model: model,
    };
    // only send keys if user typed a non-masked value
    ["openai_api_key","anthropic_api_key","groq_api_key","deepseek_api_key","gemini_api_key","cline_token","antigravity_token"].forEach(k=>{
      const v = (document.getElementById(k) as HTMLInputElement)?.value;
      if(v && !v.includes("***") && v.trim().length>0) payload[k]=v.trim();
    });
    ["openai_base_url","anthropic_base_url","ollama_base_url"].forEach(k=>{
      const v = (document.getElementById(k) as HTMLInputElement)?.value;
      if(v) payload[k]=v.trim();
    });
    const r = await fetch(`${API}/api/settings`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)});
    const j = await r.json();
    setMsg(j.ok ? "Saved ✓ — keys are stored on your server (not .env)" : "Save failed: "+JSON.stringify(j));
    load();
    setTimeout(()=>setMsg(""),3000);
  };

  const testProvider = async()=>{
    setTesting(true);
    setMsg("Testing...");
    try{
      const r = await fetch(`${API}/api/settings/test`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({provider:active, model})});
      const j = await r.json();
      setMsg(j.ok ? `✓ Connected to ${active} — ${j.sample||j.info||"ok"}` : `✗ ${j.error||"failed"}`);
    }catch(e:any){ setMsg("Test failed: "+e.message); }
    setTesting(false);
  };

  if(!data) return <div className="card">Loading settings...</div>;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="card border-violet-500/20">
        <h1 className="text-xl font-black" style={{fontFamily:'Plus Jakarta Sans'}}>🔑 In-App API Keys</h1>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          Add keys <b>inside the app</b> — no .env needed. Keys are stored on <b>your</b> server (self-host localhost or Railway). Supports OpenAI-compatible & Anthropic-compatible APIs. Switch provider anytime without restarting.
        </p>
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs leading-relaxed">
          <b>Privacy:</b> Keys never leave your server. They are encoded in your Postgres. Your frontend (Vercel/Netlify) only sends them to <b>your</b> backend. Not shared with us.
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <div className="text-sm font-bold">Active provider</div>
          <div className="text-xs text-zinc-500">Which LLM powers Viral Hook Finder.</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {PROVIDERS.map(p=>(
              <button key={p.id} onClick={()=>setActive(p.id)} className={`p-3 rounded-2xl border text-left ${active===p.id?"bg-violet-600 border-violet-500 text-white":"bg-zinc-800 border-zinc-700"}`}>
                <div className="font-bold text-sm">{p.icon} {p.label} {active===p.id&&"✓"}</div>
                <div className="text-xs opacity-70 mt-0.5">{p.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Model</label>
          <input value={model} onChange={e=>setModel(e.target.value)} placeholder="gpt-4o-mini or claude-3-5-sonnet or llama3-70b-8192" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
          <div className="text-xs text-zinc-500 mt-1">OpenAI-compatible: any model name your base_url supports. Ollama: llama3, mistral, etc.</div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-bold">Keys — paste directly here (saves to vault)</div>

          <div>
            <label className="text-xs text-zinc-400">OpenAI API Key</label>
            <input id="openai_api_key" placeholder={data.openai_api_key_masked || "sk-proj-..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
            <input id="openai_base_url" defaultValue={data.openai_base_url} placeholder="https://api.openai.com/v1" className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-2.5 text-xs" />
            <div className="text-[11px] text-zinc-500 mt-1">Custom OpenAI-compatible URL allowed (e.g. https://api.openai.com/v1, Groq, Together, OpenRouter, Fireworks)</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-3">
            <div>
              <label className="text-xs text-zinc-400">Anthropic API Key (Claude)</label>
              <input id="anthropic_api_key" placeholder={data.anthropic_api_key_masked || "sk-ant-..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              <input id="anthropic_base_url" defaultValue={data.anthropic_base_url} placeholder="https://api.anthropic.com" className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-2.5 text-xs" />
              <div className="text-[11px] text-zinc-500 mt-1">Anthropic-compatible proxies also work.</div>
            </div>
            <div>
              <label className="text-xs text-zinc-400">Groq API Key</label>
              <input id="groq_api_key" placeholder={data.groq_api_key_masked || "gsk_..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              <div className="text-[11px] text-zinc-500 mt-1">Free fast LLM — recommended if no OpenAI key.</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400">DeepSeek</label>
                <input id="deepseek_api_key" placeholder={data.deepseek_api_key_masked || "sk-..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Gemini</label>
                <input id="gemini_api_key" placeholder={data.gemini_api_key_masked || "AI..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400">Ollama Local URL</label>
              <input id="ollama_base_url" defaultValue={data.ollama_base_url} placeholder="http://localhost:11434" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              <div className="text-[11px] text-zinc-500">Self-hosted local LLM — no key needed.</div>
            </div>
          </div>

          <div className="bg-violet-950/30 border border-violet-800/50 rounded-2xl p-3 space-y-3">
            <div className="text-xs font-bold text-violet-300">OAuth — Cline / Antigravity / Custom (optional)</div>
            <div>
              <label className="text-xs text-zinc-400">Cline Token (OAuth)</label>
              <input id="cline_token" placeholder={data.cline_token_masked || "cline_..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              <div className="text-[11px] text-zinc-500">Paste OAuth access token from Cline. Stored as cline_token. Add custom base_url via API POST /api/settings with oauth_tokens.</div>
            </div>
            <div>
              <label className="text-xs text-zinc-400">Antigravity Token (OAuth)</label>
              <input id="antigravity_token" placeholder={data.antigravity_token_masked || "ag_..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
            </div>
            <div className="text-[11px] text-zinc-500">For full OAuth flow (redirect) — extend /api/settings/oauth/cline and /antigravity. Placeholder ready; tokens accepted directly for self-host.</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="btn flex-1">Save Keys to Vault ✓</button>
          <button onClick={testProvider} disabled={testing} className="btn-ghost disabled:opacity-50">{testing?"Testing...":"Test Active Provider"}</button>
        </div>
        {msg && <div className="text-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-3">{msg}</div>}
        <div className="text-[11px] text-zinc-500 leading-relaxed">
          Alternative: still supports <code className="bg-zinc-800 px-1 py-0.5 rounded">.env</code> — if no vault key, backend falls back to .env OPENAI_API_KEY. But <b>in-app vault is now primary.</b>
        </div>
      </div>

      <div className="card bg-zinc-900/50">
        <div className="text-sm font-bold">Custom OpenAI-Compatible Provider (any URL)</div>
        <p className="text-xs text-zinc-500 mt-1">Point OpenAI Base URL to any compatible: OpenRouter, Together, Fireworks, Anyscale, Perplexity, etc. Just change Base URL + model + key above.</p>
        <div className="text-xs bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-2 font-mono">
          POST /api/settings {"{"} "openai_base_url": "https://openrouter.ai/api/v1", "openai_api_key": "sk-or-...", "active_llm_model": "anthropic/claude-3.5-sonnet" {"}"}
        </div>
      </div>
    </div>
  );
}
