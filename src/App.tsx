import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-fuchsia-500/30 overflow-x-hidden relative">
      
      {/* Background neon ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/4"></div>

      {/* Header */}
      <header className="w-full p-6 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-purple-600 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          SYNTHSNAKE
        </h1>
        <p className="text-cyan-400/60 font-mono text-sm tracking-[0.3em] mt-2 border-b border-cyan-400/20 pb-1 px-4">
          CYBERNETIC ENTERTAINMENT SYSTEM
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 p-6 relative z-10 mt-8 mb-24 lg:mb-12">
        <div className="w-full lg:w-2/3 flex justify-center">
          <SnakeGame />
        </div>
      </main>

      {/* Music Player Footer Setup */}
      <div className="w-full px-6 py-8 relative z-20 mt-auto">
        <MusicPlayer />
      </div>

    </div>
  );
}
