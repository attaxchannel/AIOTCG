import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AIOTCG Studio',
  description: 'All-In Tools Content Generator - Auto viral clips, captions, auto-frame',
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-black text-white selection:bg-violet-500/30">
        {/* Top bar */}
        <header className="sticky top-0 z-40 backdrop-blur bg-black/80 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-600 grid place-items-center font-black">A</div>
              <span className="font-bold tracking-tight">AIOTCG</span>
              <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full ml-2">PWA</span>
            </div>
            <nav className="flex gap-2 text-sm">
              <a href="/" className="px-3 py-1.5 rounded-full bg-zinc-900">Generate</a>
              <a href="/jobs" className="px-3 py-1.5 rounded-full bg-zinc-900">Projects</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 pb-24 pt-4">{children}</main>
        {/* Bottom nav for phone */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-950 border-t border-zinc-800 flex justify-around py-2 pb-safe">
          <a href="/" className="flex flex-col items-center gap-1 text-xs"><span className="text-lg">⚡</span>Generate</a>
          <a href="/jobs" className="flex flex-col items-center gap-1 text-xs"><span className="text-lg">📁</span>Projects</a>
          <a href="/editor" className="flex flex-col items-center gap-1 text-xs"><span className="text-lg">✂️</span>Editor</a>
        </nav>
        <script dangerouslySetInnerHTML={{__html: `if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'));`}} />
      </body>
    </html>
  );
}
