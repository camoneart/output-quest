"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { Howl } from "howler";
import { Headphones, HeadphoneOff } from "lucide-react";
import styles from "./AudioPlayer.module.css";
import { useAudio } from "@/contexts/AudioContext";

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
		volume = 1,
	}: AudioPlayerProps) => {
		const [isPlaying, setIsPlaying] = useState(false);
		const { isMuted, toggleMute } = useAudio();
		const [sound, setSound] = useState<Howl | null>(null);

		const handleClick = useCallback(() => {
			toggleMute();
		}, [toggleMute]);

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
				onplayerror: (id: number, error: unknown) => {
					console.error("Error playing audio:", error);
					setIsPlaying(false);
				},
			});

			setSound(newSound);
			return () => {
				newSound.unload();
			};
		}, [src, volume]);

		useEffect(() => {
			if (!sound) return;
			sound.mute(isMuted);

			if (!isMuted && !isPlaying) {
				sound.play();
			}
		}, [sound, isMuted, isPlaying]);

		return (
			<button
				onClick={handleClick}
				className={`hidden lg:block md:sticky md:inset-0 ${styles["audio-button"]} ${className}`}
				aria-label={isMuted ? "Unmute" : "Mute"}
			>
				<div className={styles["audio-button-icon-box"]}>
					{isMuted ? (
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
