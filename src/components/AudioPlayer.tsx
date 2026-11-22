"use client";

import { useRef, useState } from "react";
import { trackEvent, type TrackParams } from "@/lib/track";

export default function AudioPlayer({ src, label, params }: { src: string; label: string; params: TrackParams }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function play() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    trackEvent("play_audio", params);
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
