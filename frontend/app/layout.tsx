import './globals.css';
import GalaxyBackground from '../components/GalaxyBackground';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AIOTCG — Content OS | Auto Viral Clips & Studio Editor',
  description: 'Self-hosted Content OS — Whisper large-v3, YOLO auto-frame, TikTok captions, FFmpeg GPU. 100+ tools for Shorts/Reels/TikTok. PWA + BYO keys.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'AIOTCG', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen">
        <GalaxyBackground />

        <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/70 border-b border-white/[0.07]">
          <div className="max-w-[1160px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black grid place-items-center font-black text-[15px] tracking-tighter">A</div>
              <div>
                <div className="font-black tracking-[-0.02em] leading-none text-[15px]">AIOTCG</div>
                <div className="text-[11px] text-zinc-500 leading-none font-medium tracking-wide">CONTENT OS</div>
              </div>
              <span className="hidden sm:inline text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-medium">PWA • Self-Hosted</span>
            </a>
            <nav className="hidden md:flex items-center gap-1.5 text-sm">
              <a href="/" className="px-4 py-2 rounded-full bg-white text-black font-semibold">Studio</a>
              <a href="/jobs" className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">Projects</a>
              <a href="/editor" className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">Editor</a>
              <a href="/docs" className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">Docs</a>
              <a href="/settings" className="px-4 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500">Vault</a>
            </nav>
            <a href="/settings" className="md:hidden w-9 h-9 rounded-full bg-violet-600 grid place-items-center text-white">◈</a>
          </div>
        </header>

        <main className="max-w-[1160px] mx-auto px-4 pb-28 pt-6">{children}</main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-zinc-950/85 backdrop-blur-xl border-t border-white/[0.07] px-2 pt-2 pb-safe">
          <div className="flex justify-around gap-1 max-w-md mx-auto">
            {[
              {href:"/", icon:"◈", label:"Studio"},
              {href:"/jobs", icon:"▣", label:"Projects"},
              {href:"/editor", icon:"✂", label:"Editor"},
              {href:"/settings", icon:"⬢", label:"Vault"},
              {href:"/docs", icon:"≡", label:"Docs"},
            ].map(i=>(
              <a key={i.href} href={i.href} className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl active:bg-white/10 min-w-[64px]">
                <span className="text-[16px] font-bold">{i.icon}</span>
                <span className="text-[11px] text-zinc-400 font-medium">{i.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <script dangerouslySetInnerHTML={{__html: `if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'));`}} />
      </body>
    </html>
  );
}
