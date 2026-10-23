export default function DocsPage(){
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="card border-violet-500/20">
        <h1 className="text-xl font-black" style={{fontFamily:'Plus Jakarta Sans'}}>📖 AIOTCG Docs</h1>
        <p className="text-sm text-zinc-400 mt-1">Human Touch + 50+ Tools • Phone-first PWA • Self-host localhost/Chrome on phone & PC.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href="/" className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold">Generate</a>
          <a href="/settings" className="bg-zinc-800 border border-zinc-700 px-4 py-1.5 rounded-full text-xs">🔑 Keys</a>
          <a href="https://github.com/attaxchannel/AIOTCG" target="_blank" className="bg-zinc-800 border border-zinc-700 px-4 py-1.5 rounded-full text-xs">GitHub ↗</a>
        </div>
      </div>
      <div className="card space-y-3">
        <h2 className="font-bold">🌶️ Self-Host on Localhost — Phone & PC (Chrome)</h2>
        <div className="text-sm leading-relaxed text-zinc-300">
          <b>PC Chrome (Windows/Mac/Linux):</b><br/>
          <code className="bg-zinc-800 px-2 py-1 rounded text-xs">git clone https://github.com/attaxchannel/AIOTCG.git && cd AIOTCG && cp .env.example .env && docker compose up --build -d</code><br/>
          Edit <code className="bg-zinc-800 px-1 rounded">.env</code> OR use in-app <a href="/settings" className="text-violet-400">🔑 Keys</a> (recommended). Open <code className="bg-zinc-800 px-1 rounded">http://localhost:3000</code> (frontend) and <code className="bg-zinc-800 px-1 rounded">http://localhost:8000/docs</code> (API).<br/><br/>
          <b>Phone Chrome (Android, no PC):</b><br/>
          • <b>Fastest:</b> Deploy frontend to Vercel/Netlify from phone browser (see DEPLOY.md), backend to Railway/Render from phone. Then open your <code className="bg-zinc-800 px-1 rounded">vercel.app</code> on Chrome → Add to Home Screen.<br/>
          • <b>Pure localhost on phone:</b> Install <b>Termux</b> → <code className="bg-zinc-800 px-2 py-1 rounded text-xs">pkg install git nodejs; git clone ...; cd AIOTCG/frontend; npm install; npm run dev</code> → Chrome <code className="bg-zinc-800 px-1 rounded">http://localhost:3000</code>. Or use <b>GitHub Codespaces</b> on phone Chrome → Code → Codespaces → New → <code className="bg-zinc-800 px-1 rounded">docker compose up</code>.<br/>
          • <b>Expose localhost to phone:</b> PC <code className="bg-zinc-800 px-1 rounded">cloudflared tunnel --url http://localhost:3000</code> → open URL on phone Chrome.<br/>
        </div>
      </div>
      <div className="card space-y-2 text-sm leading-relaxed">
        <h2 className="font-bold">50+ Features at a Glance</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-400">
          <li>🎯 Viral Finder • 💬 Pop Captions • 🎥 YOLO Frame • 🔇 Denoise • 📐 4 Ratios</li>
          <li>✂️ Timeline • 🔑 BYO Keys • 📱 PWA • 🔄 tus 4G • 🗣️ Whisper large-v3</li>
          <li>🎨 12 Caption Styles • 🖼️ B-Roll • 🔊 Ducking • 🌗 Thumbnail • 📝 Hashtags</li>
          <li>🌐 Translate ID/EN • ⚡ GPU • ☁️ MinIO • 🔔 Push • 📊 Score • 🧠 Saliency</li>
          <li>🎞️ Transitions • 🔤 Fonts • 📏 Safe Zones • 👥 Multi-Tenant • 📦 Batch</li>
          <li>🔍 pgvector Search • 📈 Analytics • 🧩 Templates • 🎙️ TTS • ✨ Highlights</li>
        </ul>
        <div className="text-xs text-zinc-500 mt-2">Keys in-app supports: OpenAI, Anthropic Claude, Groq, DeepSeek, Gemini, Ollama, Cline OAuth, Antigravity OAuth, any OpenAI-compatible base_url.</div>
      </div>
      <div className="card bg-zinc-900/50 text-xs leading-relaxed">
        <b>GitHub Deep Research (25+ repos):</b> SYSTRAN/faster-whisper, m-bain/WhisperX, jianchang512/pyvideotrans, s0md3v/autocut, harry0703/MoneyPrinterTurbo, Ultralytics, demucs, voice-pro, meetily, Remotion, ffmpeg.wasm, tus, Litellm, Ollama, coqui-ai/TTS, OpenVoice, transformers. See <code className="bg-zinc-800 px-1 rounded">docs/GITHUB_REFS.md</code>.
      </div>
    </div>
  );
}
