"use client";

import React, { useEffect, useState } from "react";
import styles from "./AdventureStartLink.module.css";
import Link from "next/link";
import Image from "next/image";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import { useUser } from "@clerk/nextjs";
import { UserInfo } from "@/features/connection/types";

const AdventureStartLink = () => {
	const { user, isLoaded } = useUser();
	const [targetPath, setTargetPath] = useState<string>("/connection");

	useEffect(() => {
		const decidePath = async () => {
			if (!isLoaded || !user) return;
			try {
				const res = await fetch("/api/user", { cache: "no-store" });
				const data: { success: boolean; user?: UserInfo } = await res.json();
				if (data.success && data.user?.zennUsername) {
					setTargetPath("/dashboard");
				}
			} catch {
				// ignore error and keep default
			}
		};
		decidePath();
	}, [isLoaded, user?.id]);

	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});

	return (
		<div className={`${styles["adventure-start-link-box"]}`}>
			<Link
				href={targetPath}
				className={`${styles["adventure-start-link"]}`}
				onClick={() => playClickSound()}
			>
				<Image
					src="/images/arrow/arrow-icon.svg"
					alt="冒険をはじめる"
					width={20}
					height={20}
					className={styles["adventure-start-link-icon"]}
				/>
				<span className={styles["adventure-start-link-text"]}>
					冒険をはじめる
				</span>
			</Link>
		</div>
	);
};

export default AdventureStartLink;
