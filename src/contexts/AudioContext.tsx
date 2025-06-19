"use client";

import React, {
	createContext,
	useState,
	useCallback,
	use,
	ReactNode,
} from "react";

interface AudioContextType {
	isMuted: boolean;
	toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
	const [isMuted, setIsMuted] = useState(true);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => !prev);
	}, []);

	return (
		<AudioContext value={{ isMuted, toggleMute }}>{children}</AudioContext>
	);
};

export const useAudio = () => {
	const context = use(AudioContext);
	if (context === undefined) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
};
