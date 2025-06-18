"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import styles from "./HomeStartButton.module.css";

const HomeStartButton = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const [isZennConnected, setIsZennConnected] = useState(false);

	const { playClickSound } = useClickSound({
		soundPath: "/audio/start-sound.mp3",
		volume: 1,
	});

	useEffect(() => {
		if (isLoaded && user) {
			const fetchUserStatus = async () => {
				try {
					const response = await fetch("/api/user");
					if (response.ok) {
						const data = await response.json();
						if (data.success && data.user && data.user.zennUsername) {
							setIsZennConnected(true);
						}
					}
				} catch (error) {
					console.error("Failed to fetch user status:", error);
				}
			};
			fetchUserStatus();
		}
	}, [isLoaded, user]);

	const destination = isZennConnected ? "/connection" : "/about";

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		playClickSound();

		setTimeout(() => {
			router.push(destination);
		}, 700);
	};

	return (
		<div className={`${styles["start-btn-container"]}`}>
			<Link
				href={destination}
				className={`${styles["start-btn"]}`}
				onClick={handleClick}
			>
				はじめる
			</Link>
		</div>
	);
};

export default HomeStartButton;
