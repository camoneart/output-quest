import { cache } from "react";
import { getUser } from "@/features/user/_lib/fetcher";
import { getZennArticles } from "@/features/zenn/_lib/fetcher";
import { HeroData } from "@/types/hero.types";
import { strengthHeroData } from "@/features/strength/data/strengthHeroData";

/**
 * ダッシュボード用のHeroDataを取得する関数（Request Memoization対応）
 *
 * HeroContextのロジックをServer Component用に移植。
 * React 19のcache()を使用して、同一リクエスト内で複数回呼び出されても
 * 実際のDB/API呼び出しは1回のみ実行される。
 *
 * ロジック:
 * 1. ユーザー情報を取得
 * 2. Zenn記事を全件取得
 * 3. 記事数からレベルを計算
 * 4. HeroDataを返す
 *
 * @returns HeroData
 */
export const getDashboardHeroData = cache(async (): Promise<HeroData> => {
	try {
		// Request Memoization: getUser()は同一リクエスト内で1回のみ実行
		const user = await getUser();

		// ユーザー名を決定（ログインユーザー or ゲスト）
		const username = user?.zennUsername || "aoyamadev";

		// Request Memoization: getZennArticles()は同一リクエスト内で1回のみ実行
		const articles = await getZennArticles(username, { fetchAll: true });

		// 記事数からレベルを計算（1投稿 = 1レベル）
		const articlesCount = articles.length;
		const calculatedLevel = Math.max(articlesCount, 1); // 最低レベル1

		// HeroDataを構築
		const heroData: HeroData = {
			...strengthHeroData,
			level: calculatedLevel,
			currentExp: 40,
			nextLevelExp: 100,
			remainingArticles: 1,
		};

		return heroData;
	} catch (error) {
		console.error("Failed to fetch dashboard hero data:", error);

		// エラー時はデフォルトデータを返す
		return {
			...strengthHeroData,
			level: 1,
		};
	}
});

/**
 * ダッシュボードHeroDataをプリロードする関数
 *
 * フェッチを早期に開始し、ウォーターフォールを防ぐために使用。
 * awaitせずに呼び出すことで、バックグラウンドでフェッチを開始する。
 */
export const preloadDashboardHeroData = () => {
	void getDashboardHeroData(); // Promiseを開始するだけ（awaitしない）
};
