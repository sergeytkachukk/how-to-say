"use client";

import { useRef, useState } from "react";

export default function AudioPlayer({ src, label }: { src: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function play() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }

  return (
    <div>
      <button type="button" className="play-button" onClick={play} aria-label={label}>
        {isPlaying ? "Playing..." : "▶ Listen"}
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
