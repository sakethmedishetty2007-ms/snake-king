import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2, Music } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'Neon Highway', artist: 'CyberGen', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 2, title: 'Synthetic Dreams', artist: 'Neural Network', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 3, title: 'Quantum Groove', artist: 'AI Overlord', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' }
];

export function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIdx];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <Music className={`text-white z-10 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying && (
             <div className="absolute inset-0 border-2 border-white/50 rounded-full animate-ping opacity-20"></div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-fuchsia-400 font-bold truncate tracking-wide text-lg drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]">{currentTrack.title}</h3>
          <p className="text-cyan-300/70 text-sm truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <div 
        className="h-1.5 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(217,70,239,0.8)] group-hover:from-cyan-300 group-hover:to-fuchsia-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4">
        <button 
          onClick={prevTrack}
          className="p-2 text-cyan-400 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] transition-all"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>
        <button 
          onClick={togglePlay}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-800 text-fuchsia-500 border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] hover:bg-slate-700 hover:scale-105 transition-all"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-2 text-cyan-400 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] transition-all"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
