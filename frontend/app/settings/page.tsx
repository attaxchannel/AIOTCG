'use client';
import { useEffect, useState, useRef } from 'react';
import { API } from '../../lib/api';

const PROVIDERS = [
  {id:"openai", label:"OpenAI", icon:"◈", hint:"gpt-4o-mini • gpt-4o • any base_url", baseDefault:"https://api.openai.com/v1"},
  {id:"anthropic", label:"Anthropic", icon:"◇", hint:"claude-3.5-sonnet • haiku", baseDefault:"https://api.anthropic.com"},
  {id:"groq", label:"Groq", icon:"⚡", hint:"llama3-70b • ultra-fast • free tier", baseDefault:"https://api.groq.com/openai/v1"},
  {id:"deepseek", label:"DeepSeek", icon:"🌊", hint:"deepseek-chat • coder", baseDefault:"https://api.deepseek.com"},
  {id:"gemini", label:"Gemini", icon:"✦", hint:"gemini-1.5-flash • pro", baseDefault:"https://generativelanguage.googleapis.com"},
  {id:"ollama", label:"Ollama", icon:"⬢", hint:"Local — no key • llama3 / mistral", baseDefault:"http://localhost:11434"},
  {id:"cline", label:"Cline", icon:"⬣", hint:"OAuth token", baseDefault:""},
  {id:"antigravity", label:"Antigravity", icon:"⬔", hint:"OAuth token", baseDefault:""},
];

const DEFAULT_DATA = {
  openai_api_key_masked:"", openai_base_url:"https://api.openai.com/v1",
  anthropic_api_key_masked:"", anthropic_base_url:"https://api.anthropic.com",
  groq_api_key_masked:"", groq_base_url:"https://api.groq.com/openai/v1",
  deepseek_api_key_masked:"", gemini_api_key_masked:"",
  ollama_base_url:"http://localhost:11434", active_llm_provider:"openai", active_llm_model:"gpt-4o-mini",
  cline_token_masked:"", antigravity_token_masked:"", oauth_tokens:{}, has_openai:false, has_anthropic:false, has_groq:false,
};

export default function SettingsPage(){
  const [data,setData]=useState<any>(null);
  const [active,setActive]=useState("openai");
  const [model,setModel]=useState("gpt-4o-mini");
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");
  const [testing,setTesting]=useState(false);
  const [loading,setLoading]=useState(true);
  const loadedRef = useRef(false);

  const load = async()=>{
    setLoading(true); setErr("");
    const ctrl = new AbortController();
    const t = setTimeout(()=> ctrl.abort(), 4000);
    try{
      const r = await fetch(`${API}/api/settings`, {signal: ctrl.signal, cache:"no-store"});
      clearTimeout(t);
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setData(j);
      setActive(j.active_llm_provider || "openai");
      setModel(j.active_llm_model || "gpt-4o-mini");
      try{ localStorage.setItem("aiotcg_settings_cache", JSON.stringify(j)); }catch{}
      loadedRef.current = true;
    }catch(e:any){
      clearTimeout(t);
      // instant fallback — no spinner hang
      const cached = (()=>{ try{ return JSON.parse(localStorage.getItem("aiotcg_settings_cache")||"null"); }catch{ return null; } })();
      if(cached){ setData(cached); setActive(cached.active_llm_provider||"openai"); setModel(cached.active_llm_model||"gpt-4o-mini"); setErr(`Offline — showing cached keys. Backend unreachable at ${API}`); }
      else { setData(DEFAULT_DATA); setErr(`Backend not reachable at ${API} — you can still fill keys, they will save when backend is online. Check aiotcg-alpha.vercel.app ↔ ${API}`); }
    }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const save = async()=>{
    setMsg("Saving to vault…");
    const payload:any = { active_llm_provider: active, active_llm_model: model };
    ["openai_api_key","anthropic_api_key","groq_api_key","deepseek_api_key","gemini_api_key","cline_token","antigravity_token"].forEach(k=>{
      const v = (document.getElementById(k) as HTMLInputElement)?.value;
      if(v && !v.includes("***") && v.trim().length>0) payload[k]=v.trim();
    });
    ["openai_base_url","anthropic_base_url","ollama_base_url","groq_base_url"].forEach(k=>{
      const v = (document.getElementById(k) as HTMLInputElement)?.value;
      if(v) payload[k]=v.trim();
    });
    try{
      const ctrl = new AbortController(); setTimeout(()=>ctrl.abort(), 6000);
      const r = await fetch(`${API}/api/settings`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload), signal: ctrl.signal});
      const j = await r.json();
      if(j.ok){ setMsg("✓ Saved to vault — active: "+active+" / "+model); try{ const cur={...data,...payload, active_llm_provider:active, active_llm_model:model}; localStorage.setItem("aiotcg_settings_cache", JSON.stringify(cur)); }catch{} }
      else setMsg("Save failed: "+JSON.stringify(j).slice(0,300));
      load();
      setTimeout(()=>setMsg(""),3500);
    }catch(e:any){ setMsg("✗ Save failed: "+e.message+" — is backend online? "+API); }
  };

  const testProvider = async()=>{
    setTesting(true); setMsg("Testing "+active+"…");
    try{
      const ctrl = new AbortController(); setTimeout(()=>ctrl.abort(), 8000);
      const r = await fetch(`${API}/api/settings/test`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({provider:active, model}), signal: ctrl.signal});
      const j = await r.json();
      setMsg(j.ok ? `✓ Connected to ${active} — ${j.sample||j.info||"ok"}` : `✗ ${j.error||"failed"}`);
    }catch(e:any){ setMsg("Test failed: "+e.message); }
    setTesting(false);
  };

  if(loading){
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="card border-violet-500/20 animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-48" />
          <div className="h-3 bg-zinc-800 rounded w-full mt-3" />
          <div className="h-3 bg-zinc-800 rounded w-5/6 mt-2" />
        </div>
        <div className="card space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-32" />
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map(i=> <div key={i} className="h-16 bg-zinc-800 rounded-2xl" />)}
          </div>
          <div className="h-10 bg-zinc-800 rounded-2xl" />
        </div>
        <div className="text-xs text-zinc-500 text-center">Loading vault… if this takes &gt;4s, backend is offline — will show cached form.</div>
      </div>
    );
  }

  if(!data) return null;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="card border-violet-500/20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 grid place-items-center font-black text-white">◈</div>
          <div>
            <h1 className="text-[17px] font-black tracking-tight" style={{fontFamily:'Plus Jakarta Sans'}}>Vault — API Keys</h1>
            <div className="text-xs text-zinc-500">Stored on <b>your server</b> only • never in .env • switch providers without restart</div>
          </div>
          <span className={`ml-auto text-[11px] px-2.5 py-1 rounded-full font-bold border ${data._db==="ok"?"bg-emerald-500/15 text-emerald-400 border-emerald-500/20":"bg-amber-500/15 text-amber-300 border-amber-500/20"}`}>{data._db==="ok" ? `● vault ${data._ms||0}ms` : "○ offline cache"}</span>
        </div>
        {err && <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs leading-relaxed text-amber-200">{err}<br/><span className="text-zinc-400">Tip for aiotcg-alpha.vercel.app: backend is <code className="bg-zinc-800 px-1 rounded">{API}</code> — if it says localhost it will fail on Vercel. Use the ⦿ card on homepage to Save & Connect your Railway URL.</span></div>}
        <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-xs leading-relaxed text-zinc-400">
          Vault is <b>primary</b>; <code className="bg-zinc-800 px-1 rounded">.env</code> is fallback. All keys are base64-encoded in your Postgres (<code className="bg-zinc-800 px-1 rounded">user_settings</code>). Upgrade to Fernet in production. Frontend (Vercel) only talks to <b>your</b> backend.
        </div>
      </div>

      <div className="card space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Active provider — powers Viral Hook Finder</div>
            <span className="text-[11px] bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-full">{active} • {model}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {PROVIDERS.map(p=>(
              <button key={p.id} onClick={()=>setActive(p.id)} className={`p-3 rounded-2xl border text-left transition ${active===p.id?"bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20":"bg-zinc-800 border-zinc-700 hover:border-zinc-600"}`}>
                <div className="font-bold text-sm flex items-center gap-1.5">{p.icon} {p.label} {active===p.id&&<span className="ml-auto text-xs">●</span>}</div>
                <div className="text-xs opacity-70 mt-0.5 leading-tight">{p.hint}</div>
                {data[`has_${p.id}`] && <div className="text-[11px] mt-1 opacity-80">✓ key saved</div>}
                {p.id==="groq" && !data.has_groq && <div className="text-[11px] mt-1 text-amber-200">free tier recommended</div>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold flex items-center gap-2">Model <span className="text-xs font-normal text-zinc-500">exact name your base_url supports</span></label>
          <input value={model} onChange={e=>setModel(e.target.value)} placeholder="gpt-4o-mini / claude-3-5-sonnet / llama3-70b-8192 / gemini-1.5-flash" className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:border-violet-500 focus:outline-none" />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {["gpt-4o-mini","gpt-4o","claude-3-5-sonnet-20241022","llama3-70b-8192","deepseek-chat","gemini-1.5-flash","llama3","mistral"].map(m=>(
              <button key={m} onClick={()=>setModel(m)} className={`text-xs px-2.5 py-1 rounded-full border ${model===m?"bg-violet-600 border-violet-500 text-white":"bg-zinc-800 border-zinc-700 text-zinc-400"}`}>{m}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-bold flex items-center gap-2">Keys <span className="text-xs font-normal text-zinc-500">paste once — masked after save • leave blank to keep</span></div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">OpenAI <span className="text-zinc-500 font-normal">sk-proj-…</span> {data.has_openai&&<span className="ml-auto text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">saved</span>}</label>
              <input id="openai_api_key" placeholder={data.openai_api_key_masked || "sk-proj-... (blank = keep)"} defaultValue="" className="w-full mt-1.5 bg-black/40 border border-zinc-700 rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none" />
              <div className="flex gap-2 mt-2">
                <input id="openai_base_url" defaultValue={data.openai_base_url} placeholder="https://api.openai.com/v1" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-mono" />
                <span className="text-[11px] text-zinc-500 self-center hidden sm:inline">OpenAI-compatible: OpenRouter / Together / Fireworks …</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300">Anthropic <span className="text-zinc-500 font-normal">sk-ant-…</span> {data.has_anthropic&&<span className="ml-2 text-[11px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">saved</span>}</label>
                <input id="anthropic_api_key" placeholder={data.anthropic_api_key_masked || "sk-ant-..."} defaultValue="" className="w-full mt-1.5 bg-black/40 border border-zinc-700 rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-600" />
                <input id="anthropic_base_url" defaultValue={data.anthropic_base_url} placeholder="https://api.anthropic.com" className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-mono" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-300">Groq <span className="text-zinc-500 font-normal">gsk_…</span> {data.has_groq&&<span className="ml-2 text-[11px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">saved</span>}</label>
                <input id="groq_api_key" placeholder={data.groq_api_key_masked || "gsk_... (free & fast)"} defaultValue="" className="w-full mt-1.5 bg-black/40 border border-zinc-700 rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-600" />
                <input id="groq_base_url" defaultValue={data.groq_base_url||"https://api.groq.com/openai/v1"} placeholder="https://api.groq.com/openai/v1" className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400">DeepSeek</label>
                <input id="deepseek_api_key" placeholder={data.deepseek_api_key_masked || "sk-..."} defaultValue="" className="w-full mt-1 bg-black/40 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Gemini</label>
                <input id="gemini_api_key" placeholder={data.gemini_api_key_masked || "AI..."} defaultValue="" className="w-full mt-1 bg-black/40 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400">Ollama Local URL <span className="text-zinc-600">no key needed — runs on your server</span></label>
              <input id="ollama_base_url" defaultValue={data.ollama_base_url} placeholder="http://localhost:11434" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm font-mono" />
            </div>
          </div>

          <div className="bg-violet-950/20 border border-violet-800/40 rounded-2xl p-3 space-y-3">
            <div className="text-xs font-bold text-violet-300">OAuth — Cline / Antigravity (optional)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400">Cline Token</label>
                <input id="cline_token" placeholder={data.cline_token_masked || "cline_..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Antigravity Token</label>
                <input id="antigravity_token" placeholder={data.antigravity_token_masked || "ag_..."} defaultValue="" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm" />
              </div>
            </div>
            <div className="text-[11px] text-zinc-500">Tokens sent as OAuth — extend <code className="bg-zinc-800 px-1 rounded">/api/settings/oauth/{cline,antigravity}</code> for full redirect flow. For self-host, pasting token is enough.</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="btn flex-1 text-[15px]">Save to Vault ✓</button>
          <button onClick={testProvider} disabled={testing} className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 px-5 py-3.5 rounded-2xl text-sm font-semibold disabled:opacity-50 transition">{testing?"Testing…":"Test"}</button>
        </div>
        {msg && <div className="text-xs rounded-2xl p-3 border bg-zinc-900 border-zinc-800 leading-relaxed">{msg}</div>}
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span>Vault: <code className="bg-zinc-800 px-1 rounded">POST /api/settings</code></span>
          <span>•</span>
          <a href={`${API}/docs`} target="_blank" className="text-violet-400">API Docs ↗</a>
          <span className="ml-auto">{API}</span>
        </div>
      </div>

      <div className="card border-amber-500/20 bg-amber-950/10">
        <div className="text-sm font-bold">⦿ NEXT_PUBLIC_API_URL — Studio connection</div>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Frontend (<b>aiotcg-alpha.vercel.app</b> on phone/PC) → Backend (FastAPI on Railway). If Vault says <i>Backend not reachable</i>, fix the URL on <a href="/" className="text-violet-400">homepage → ⦿ card → Save & Connect</a> or Vercel env. See <code className="bg-zinc-800 px-1 rounded">frontend/.env.example</code>.</p>
      </div>

      <div className="card bg-zinc-900/50">
        <div className="text-sm font-bold">Custom OpenAI-Compatible — any provider</div>
        <p className="text-xs text-zinc-500 mt-1">Set OpenAI Base URL to OpenRouter / Together / Fireworks / Anyscale / Perplexity. Example:</p>
        <div className="text-xs bg-black/30 border border-zinc-800 rounded-xl p-3 mt-2 font-mono leading-relaxed overflow-auto">
          POST /api/settings {"{"} "openai_base_url": "https://openrouter.ai/api/v1", "openai_api_key": "sk-or-...", "active_llm_model": "anthropic/claude-3.5-sonnet" {"}"}
        </div>
      </div>
    </div>
  );
}
