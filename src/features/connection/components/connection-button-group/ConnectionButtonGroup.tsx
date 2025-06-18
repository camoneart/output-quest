import React from "react";
import { RefreshCcw, Unplug, Newspaper } from "lucide-react";
import styles from "./ConnectionButtonGroup.module.css";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import Link from "next/link";

interface ConnectionButtonGroupProps {
	loading: boolean;
	userInfo: {
		zennUsername?: string;
		displayName?: string;
		profileImage?: string;
		zennArticleCount: number;
	};
	onSync: () => void;
	onRelease: () => void;
}

const ConnectionButtonGroup: React.FC<ConnectionButtonGroupProps> = ({
	loading,
	userInfo,
	onSync,
	onRelease,
}) => {
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});

	const handleClick = () => {
		playClickSound();
		onSync();
	};

	const handleReleaseClick = () => {
		playClickSound();
		if (confirm("Zennのアカウント連携を解除しますか？")) {
			onRelease();
		}
	};

	return (
		<div className={styles["button-group"]}>
			<div className={styles["sync-button-box"]}>
				<button
					onClick={handleClick}
					className={styles["sync-button"]}
					disabled={loading || !userInfo.zennUsername}
				>
					<RefreshCcw size={16} />
					<span className={styles["sync-button-text"]}>
						{loading ? "同期中..." : "同期する"}
					</span>
				</button>
			</div>

			<div className={styles["view-zenn-posts-link-box"]}>
				<Link
					href={`https://zenn.dev/${userInfo.zennUsername}`}
					target="_blank"
					rel="noopener noreferrer"
					className={styles["view-zenn-posts-link"]}
					onClick={() => {
						playClickSound();
					}}
				>
					<Newspaper size={16} />
					<span className={styles["view-zenn-posts-link-text"]}>
						記事を確認
					</span>
				</Link>
			</div>

			<div className={styles["release-button-box"]}>
				<button
					onClick={handleReleaseClick}
					className={styles["release-button"]}
				>
					<Unplug size={16} />
					<span className={styles["release-button-text"]}>連携解除</span>
				</button>
			</div>
		</div>
	);
};

export default ConnectionButtonGroup;
