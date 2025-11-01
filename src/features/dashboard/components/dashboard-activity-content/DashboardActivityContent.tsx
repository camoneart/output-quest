"use client";

import styles from "./DashboardActivityContent.module.css";
import Link from "next/link";
import Image from "next/image";
import { PostData } from "@/features/posts/types";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";

// カテゴリー表示用のマッピング
const CATEGORY_DISPLAY = {
	tech: "TECH",
	idea: "IDEA",
};

// プラットフォーム情報
const PLATFORM_INFO = {
	zenn: {
		name: "Zenn",
		favicon: "https://zenn.dev/images/logo-transparent.png",
	},
};

type DashboardActivityContentProps = {
	articles: PostData[];
};

export const DashboardActivityContent = ({
	articles,
}: DashboardActivityContentProps) => {
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	// 日付を表示用にフォーマットする
	const formatDate = (date: string | Date | undefined): string => {
		if (!date) return "";
		if (typeof date === "string") {
			const dateObj = new Date(date);
			return dateObj.toLocaleDateString("ja-JP", {
				year: "numeric",
				month: "numeric",
				day: "numeric",
			});
		}
		return date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});
	};

	return (
		<section className={`${styles["recent-activity-section"]}`}>
			<h2 className={`${styles["recent-activity-section-title"]}`}>
				~ 最近の記録 ~
			</h2>

			{articles.length > 0 ? (
				<ul className={`${styles["recent-activity-list"]}`}>
					{articles.map((article) => (
						<li
							key={article.id}
							className={`${styles["recent-activity-item"]}`}
						>
							<Link
								href={article.url}
								className={`${styles["recent-activity-item-link"]}`}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => playClickSound()}
							>
								<div className={`${styles["recent-activity-item-content"]}`}>
									<h3 className={`${styles["recent-activity-item-title"]}`}>
										{article.title}
									</h3>

									<hr />

									{/* カテゴリーと日付を表示する領域 */}
									<div className={`${styles["recent-activity-item-info"]}`}>
										{article.category && (
											<div
												className={`${styles["recent-activity-item-category-container"]}`}
											>
												<span
													className={`${styles["recent-activity-item-category"]}`}
												>
													{CATEGORY_DISPLAY[
														article.category as keyof typeof CATEGORY_DISPLAY
													] || article.category}
												</span>
											</div>
										)}

										<div
											className={`${styles["recent-activity-item-date-container"]}`}
										>
											<span
												className={`${styles["recent-activity-item-date"]}`}
											>
												{formatDate(article.publishedAt || article.date)}
											</span>
										</div>
									</div>

									<div
										className={`${styles["recent-activity-item-platform-container"]}`}
									>
										<Image
											src={PLATFORM_INFO.zenn.favicon}
											alt="Zenn favicon"
											width={14}
											height={14}
											className={`${styles["recent-activity-item-favicon"]}`}
										/>
										<p className={`${styles["recent-activity-item-platform"]}`}>
											{PLATFORM_INFO.zenn.name}
										</p>
									</div>
								</div>
								<div className={`${styles["recent-activity-item-exp"]}`}>
									+1 EXP
								</div>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p className="p-[5px] text-center text-sm grid place-items-center">
					投稿された記事がありません。
				</p>
			)}
		</section>
	);
};
