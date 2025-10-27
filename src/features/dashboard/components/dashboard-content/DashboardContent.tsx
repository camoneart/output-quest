import { getDashboardHeroData } from "@/features/dashboard/_lib/fetcher";
import { heroLevelAndItemRelation } from "@/features/items/data/itemsData";
import DashboardContentClient from "./DashboardContentClient";
import DashboardActivitySection from "../dashboard-activity-section/DashboardActivitySection";

/**
 * DashboardContent (Server Component)
 *
 * Request Memoizationを活用したデータフェッチを行い、
 * 取得したデータをClient Componentに渡す。
 *
 * Server ComponentとClient Componentを適切に配置する。
 *
 * 変更点:
 * - Client Component → Server Componentに変換
 * - useHero(), useState, useEffectを削除
 * - データフェッチをサーバー側で同期的に実行
 * - Server ComponentはここでレンダリングしてClient Componentにslotとして渡す
 */
const DashboardContent = async () => {
	// ✅ Request Memoization: 同一リクエスト内で1回のみ実行
	const heroData = await getDashboardHeroData();

	// lastAcquiredItemIdを計算（useEffectのロジックを移植）
	const acquiredItemIds = Object.entries(heroLevelAndItemRelation)
		.filter(([, requiredLevel]) => heroData.level >= requiredLevel)
		.map(([itemIdStr]) => parseInt(itemIdStr, 10));

	const lastAcquiredItemId =
		acquiredItemIds.length > 0 ? Math.max(...acquiredItemIds) : null;

	// Client Componentにデータを渡す
	// Server ComponentはCompositionパターン（children）で渡す
	return (
		<DashboardContentClient
			heroData={heroData}
			lastAcquiredItemId={lastAcquiredItemId}
		>
			<DashboardActivitySection />
		</DashboardContentClient>
	);
};

export default DashboardContent;
