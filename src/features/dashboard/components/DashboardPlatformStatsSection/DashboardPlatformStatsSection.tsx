"use client";

import React from "react";
import styles from "./DashboardPlatformStatsSection.module.css";
import { DashboardData } from "../../types/dashboard.types";
import { useHero } from "@/contexts/HeroContext";
import XShareButton from "@/components/common/XShareButton/XShareButton";

type DashboardPlatformStatsSectionProps = {
	dashboardData: DashboardData;
};

const DashboardPlatformStatsSection = ({
	dashboardData,
}: DashboardPlatformStatsSectionProps) => {
	const { heroData, isLoading, error } = useHero();

	// 実際のZennデータとモックデータを組み合わせてstatsを作成
	const zennStat = {
		platform: "Zenn",
		count: isLoading ? dashboardData.postStats[0].count : heroData.level,
		color: "#3ea8ff",
	};

	return (
		<section className={`${styles["platform-stats-section"]}`}>
			<h2 className={`${styles["platform-stats-title"]}`}>~ 投稿状況 ~</h2>
			<div className={`${styles["platform-stats-container"]}`}>
				<div className={`${styles["platform-stats-grid"]}`}>
					<div
						className={`${styles["platform-stat-card"]} ${styles["platform-stat-card-zenn"]}`}
					>
						<div className={`${styles["platform-stat-card-content"]}`}>
							<h3 className={`${styles["platform-stat-card-title"]}`}>
								{zennStat.platform}
							</h3>
							<div className={`${styles["platform-stat-count"]}`}>
								{isLoading ? (
									<span className={`${styles["platform-stat-loading"]}`}>
										読み込み中...
									</span>
								) : error ? (
									<>
										<span className={`${styles["platform-stat-error"]}`}>
											0
										</span>
										<span className={`${styles["platform-stat-unit"]}`}>
											記事
										</span>
									</>
								) : (
									<>
										<em className={`${styles["platform-stat-count-em"]}`}>
											{zennStat.count}
										</em>
										<span className={`${styles["platform-stat-unit"]}`}>
											記事
										</span>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				{/* Xへのシェアリンク */}
				<XShareButton
					level={zennStat.count}
					username=""
					customText="Zennの投稿数をXでシェアする"
					customShareText={`【新たな記録！】\n⭐️ 勇者は Zennの投稿数が「${zennStat.count}本」になった！\n\n新感覚学習RPG：「OUTPUT QUEST ~ 叡智の継承者 ~」で学びの冒険をいま、始めよう！\n\n#OUTPUTQUEST #叡智の継承者\n\n@bojjidev\n`}
					className={`${styles["platform-stat-share-link"]}`}
					iconWrapClassName={`${styles["platform-stat-share-icon-wrap"]}`}
					iconClassName={`${styles["platform-stat-share-icon"]}`}
					textClassName={`${styles["platform-stat-share-link-text"]}`}
					iconWidth={11}
					iconHeight={11}
				/>
			</div>
		</section>
	);
};

export default DashboardPlatformStatsSection;
