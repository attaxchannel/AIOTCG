import './globals.css';
import GalaxyBackground from '../components/GalaxyBackground';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AIOTCG Studio — Human Made, AI Powered',
  description: 'All-In Tools Content Generator — Auto viral clips, studio captions, human-touch editor. Self-hosted PWA.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'AIOTCG', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
  themeColor: '#7C3AED',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Plus+Jakarta+Sans:wght@700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen">
        <GalaxyBackground />

        <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 grid place-items-center font-black text-white shadow-lg shadow-violet-600/30">A</div>
              <div>
                <div className="font-black tracking-tight leading-none" style={{fontFamily:'Plus Jakarta Sans'}}>AIOTCG</div>
                <div className="text-[11px] text-zinc-400 leading-none">Human Touch Studio</div>
              </div>
              <span className="hidden sm:inline text-[11px] bg-white/10 border border-white/10 px-2 py-1 rounded-full ml-1">PWA • Offline</span>
            </a>
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <a href="/" className="px-4 py-2 rounded-full bg-white text-black font-semibold">Generate</a>
              <a href="/jobs" className="px-4 py-2 rounded-full bg-white/10 border border-white/10">Projects</a>
              <a href="/editor" className="px-4 py-2 rounded-full bg-white/10 border border-white/10">Editor</a>
              <a href="/settings" className="px-4 py-2 rounded-full bg-white/10 border border-white/10">🔑 Keys</a>
            </nav>
            <a href="/settings" className="md:hidden w-9 h-9 rounded-full bg-white/10 border border-white/10 grid place-items-center">🔑</a>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 pb-28 pt-5">{children}</main>

        {/* Human dock - phone thumb zone */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-t border-white/[0.08] px-2 pt-2 pb-safe">
          <div className="flex justify-around gap-1 max-w-md mx-auto">
            {[
              {href:"/", icon:"⚡", label:"Generate"},
              {href:"/jobs", icon:"📁", label:"Projects"},
              {href:"/editor", icon:"✂️", label:"Editor"},
              {href:"/settings", icon:"🔑", label:"Keys"},
              {href:"/docs", icon:"📖", label:"Docs"},
            ].map(i=>(
              <a key={i.href} href={i.href} className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl active:bg-white/10 min-w-[64px]">
                <span className="text-[18px]">{i.icon}</span>
                <span className="text-[11px] text-zinc-300">{i.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <script dangerouslySetInnerHTML={{__html: `if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'));`}} />
      </body>
    </html>
  );
}
