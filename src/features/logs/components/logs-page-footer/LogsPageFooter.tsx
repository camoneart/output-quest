"use client";

import React from "react";
import styles from "./LogsPageFooter.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";

const LogsPageFooter = () => {
	const router = useRouter();
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	return (
		<div className={styles["logs-page-footer"]}>
			<div className={styles["logs-page-back-link-box"]}>
				<Link
					href="/strength"
					className={styles["logs-page-back-link"]}
					onClick={(e) => handleNavigation(e, "/strength")}
				>
					<Image
						src="/images/arrow/arrow-icon.svg"
						alt="戻る"
						width={20}
						height={20}
						className={styles["logs-page-back-link-icon"]}
					/>
					<span className={styles["logs-page-back-link-text"]}>戻る</span>
				</Link>
			</div>
		</div>
	);
};

export default LogsPageFooter;
