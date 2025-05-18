"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { Howl } from "howler";
import { Headphones, HeadphoneOff } from "lucide-react";
import styles from "./AudioPlayer.module.css";

interface AudioPlayerProps {
  src: string;
  size?: number;
  color?: string;
  className?: string;
  volume?: number;
}

const AudioPlayer = memo(
  ({
    src,
    size = 17,
    color = "currentColor",
    className = "audio-button",
    volume = 1, // デフォルトの音量を1に設定
  }: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [sound, setSound] = useState<Howl | null>(null);

    // handleClickをメモ化
    const handleClick = useCallback(() => {
      if (!sound) return;

      if (!isPlaying) {
        sound.volume(isMuted ? 0 : volume);
        sound.play();
      } else {
        setIsMuted(!isMuted);
        sound.volume(isMuted ? volume : 0);
      }
    }, [sound, isPlaying, isMuted, volume]);

    useEffect(() => {
      const newSound = new Howl({
        src: [src],
        volume: volume,
        html5: true,
        autoplay: false,
        loop: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onloaderror: (id: number, error: unknown) =>
          console.error("Error loading audio:", error),
        onplayerror: (id: number, error: unknown) =>
          console.error("Error playing audio:", error),
      });

      setSound(newSound);
      return () => {
        newSound.unload();
      };
    }, [src, volume]);

    return (
      <button
        onClick={handleClick}
        className={`hidden lg:block md:sticky md:inset-0 ${styles["audio-button"]} ${className}`}
        aria-label={isPlaying ? (isMuted ? "Unmute" : "Mute") : "Play"}
      >
        <div className={styles["audio-button-icon-box"]}>
          {isMuted || !isPlaying ? (
            <HeadphoneOff
              size={size}
              color={color}
              className={styles["audio-mute"]}
            />
          ) : (
            <Headphones
              size={size}
              color={color}
              className={styles["audio-play"]}
            />
          )}
        </div>
      </button>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
