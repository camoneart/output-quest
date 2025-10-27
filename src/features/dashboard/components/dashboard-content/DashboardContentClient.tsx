"use client";

import { ReactNode } from "react";
import styles from "./DashboardContent.module.css";
import * as Dashboard from "@/features/dashboard/components";
import { HeroData } from "@/types/hero.types";

type DashboardContentClientProps = {
	heroData: HeroData;
	lastAcquiredItemId: number | null;
	children: ReactNode; // Server ComponentをCompositionパターンで受け取る
};

/**
 * DashboardContentClient (Client Component)
 *
 * Server Componentから渡されたデータを表示する。
 * インタラクティブな部分はここに配置される。
 *
 * Server ComponentはReactNodeとして受け取り（Compositionパターン）、
 * Client Componentの中にネストできる。
 *
 * 変更点:
 * - useHero(), useState, useEffectを削除
 * - propsでheroDataとlastAcquiredItemIdを受け取る
 * - children（Server Component）をCompositionパターンで受け取る
 */
const DashboardContentClient = ({
	heroData,
	lastAcquiredItemId,
	children,
}: DashboardContentClientProps) => {
	// ダミーデータ構築（Server Componentから渡されたデータを使用）
	const dashboardData = {
		heroData: heroData,
		postStats: [{ platform: "Zenn", count: 0, color: "#3ea8ff" }],
		recentActivity: [],
		lastItem: { id: lastAcquiredItemId || 0, name: "" },
	};

	return (
		<div className={`${styles["dashboard-content-container"]}`}>
			<Dashboard.DashboardHeroSection dashboardData={dashboardData} />

			<hr />

			<div className={styles["dashboard-zenn-area"]}>
				<Dashboard.DashboardPlatformStatsSection
					dashboardData={dashboardData}
				/>

				<hr className="block md:hidden" />

				{/* Server ComponentをCompositionパターンで配置 */}
				{children}
			</div>

			<hr />
			<Dashboard.DashboardLatestPartyMemberSection />

			<hr />
			<Dashboard.DashboardLatestItemSection />
		</div>
	);
};

export default DashboardContentClient;
