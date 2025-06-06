"use client";

import React, {
	createContext,
	useState,
	useCallback,
	useContext,
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
		<AudioContext.Provider value={{ isMuted, toggleMute }}>
			{children}
		</AudioContext.Provider>
	);
};

export const useAudio = () => {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
};
