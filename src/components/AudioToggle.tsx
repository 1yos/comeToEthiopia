import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/content";

/**
 * Sound toggle button — OFF by default, no autoplay ever.
 * Audio is disabled until a real audio file is added to public/media/ambient-krar.ogg
 * When the file exists, set AUDIO_ENABLED = true and uncomment the src line.
 */

// Set to true once public/media/ambient-krar.ogg exists on disk
// Add the path here when the file is ready: AUDIO_SRC = '/media/ambient-krar.ogg'
const AUDIO_ENABLED = false;
const AUDIO_SRC = "";

export function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!AUDIO_ENABLED) return;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.35;
    audio.src = AUDIO_SRC;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    if (!AUDIO_ENABLED) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch((err: unknown) => {
        console.warn("Audio play blocked:", err);
      });
    }
    setPlaying(!playing);
  };

  const { soundToggle } = siteContent.nav;

  return (
    <button
      onClick={toggle}
      aria-label={playing ? soundToggle.ariaOn : soundToggle.ariaOff}
      aria-pressed={playing}
      disabled={!AUDIO_ENABLED}
      style={{
        background: "none",
        border: "none",
        padding: "8px",
        cursor: AUDIO_ENABLED ? "none" : "default",
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "var(--paper)",
        fontFamily: "var(--font-body)",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        opacity: AUDIO_ENABLED ? 1 : 0.35,
      }}
    >
      <span
        aria-hidden="true"
        style={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            animate={
              playing && AUDIO_ENABLED
                ? {
                    scaleY: [0.4, 1, 0.4],
                    transition: {
                      duration: 0.7,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    },
                  }
                : { scaleY: 0.4 }
            }
            style={{
              display: "block",
              width: 2,
              height: 14,
              backgroundColor: "var(--ochre)",
              transformOrigin: "center",
            }}
          />
        ))}
      </span>
      <span style={{ opacity: 0.7 }}>
        {AUDIO_ENABLED ? (playing ? "Sound on" : "Sound off") : "Sound off"}
      </span>
    </button>
  );
}
