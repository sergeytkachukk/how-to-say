"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  BUTTON_LABELS,
  EXPERIMENT_NAME,
  getServerVariant,
  getVariant,
  subscribeToVariant,
} from "@/lib/experiment";
import { trackEvent, type TrackParams } from "@/lib/track";

export default function AudioPlayer({ src, label, params }: { src: string; label: string; params: TrackParams }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const viewedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // The server and the first render always show variant A. The real variant appears after hydration.
  const variant = useSyncExternalStore(subscribeToVariant, getVariant, getServerVariant) ?? "A";

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent("experiment_view", { ...params, experiment: EXPERIMENT_NAME });
  }, [params]);

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
        {isPlaying ? "Playing..." : BUTTON_LABELS[variant]}
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
