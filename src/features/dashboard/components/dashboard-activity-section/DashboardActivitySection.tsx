import { getUser } from "@/features/user/_lib/fetcher";
import { getZennArticles } from "@/features/zenn/_lib/fetcher";
import { DashboardActivityContent } from "./DashboardActivityContent";

/**
 * DashboardActivitySection (Server Component)
 *
 * Request Memoizationを活用したデータフェッチを行い、
 * 取得したデータをClient Componentに渡す。
 *
 * 変更点:
 * - Client Component → Server Componentに変換
 * - useEffect/useStateを削除
 * - データフェッチをサーバー側で同期的に実行
 * - インタラクティブ部分をDashboardActivityContentに分離
 */
const DashboardActivitySection = async () => {
	// ✅ Request Memoization: 同一リクエスト内で1回のみ実行
	const user = await getUser();

	// ユーザー名のフォールバック
	const username = user?.zennUsername || "aoyamadev";

	// ✅ Request Memoization: 同一リクエスト内で1回のみ実行
	const articles = await getZennArticles(username, { limit: 5 });

	// Client Componentにデータを渡す
	return <DashboardActivityContent articles={articles} />;
};

export default DashboardActivitySection;
