import "server-only"; // Part 1推奨: サーバー専用コードの保護
import { cache } from "react";
import { cacheTag } from "next/cache";
import { PostData } from "@/features/posts/types";
import { CacheTags } from "@/lib/cache-tags";

/**
 * Zenn記事取得オプション
 */
export type FetchZennArticlesOptions = {
	limit?: number;
	fetchAll?: boolean;
};

/**
 * Zenn記事を取得する内部関数（use cacheディレクティブ使用）
 *
 * Next.js 15+の"use cache"を使用した純粋なAPI取得ロジック。
 *
 * Part 3「キャッシング戦略」に基づく実装。
 *
 * @param username - Zennユーザー名
 * @param options - 取得オプション
 * @returns Zenn記事の配列
 */
async function getCachedZennArticles(
	username: string,
	options: FetchZennArticlesOptions
): Promise<PostData[]> {
	"use cache";
	cacheTag(CacheTags.zennArticles(username));

	try {
		// 全件取得の場合はlimitパラメータを送信しない
		const params = new URLSearchParams({
			username: encodeURIComponent(username),
		});

		// 全件取得でない場合、かつlimit値が指定されている場合のみ追加
		if (
			!options.fetchAll &&
			options.limit !== undefined &&
			options.limit > 0
		) {
			params.append("limit", options.limit.toString());
		}

		// サーバーサイドレンダリング時にも動作するよう、絶対URLを構築
		const baseUrl =
			process.env.NEXT_PUBLIC_BASE_URL ||
			(typeof window !== "undefined" ? window.location.origin : "");
		const apiUrl = `${baseUrl}/api/zenn?${params.toString()}`;

		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();

		if (!data.success) {
			throw new Error(data.error || "Unknown error");
		}

		return data.articles;
	} catch (error) {
		console.error("Zenn記事の取得に失敗しました:", error);
		throw error; // エラーを再スローしてSuspenseで捕捉できるようにする
	}
}

/**
 * Zenn記事を取得する関数（Request Memoization + use cache対応）
 *
 * 2層のキャッシュ戦略:
 * 1. React.cache() - Request Memoization（同一リクエスト内で重複排除）
 * 2. "use cache" - Data Cache（リクエスト間でキャッシュ）
 *
 * Part 3「キャッシング戦略」に基づく実装。
 *
 * @param username - Zennユーザー名
 * @param options - 取得オプション（limit, fetchAll）
 * @returns Zenn記事の配列
 */
export const getZennArticles = cache(
	async (
		username: string = "aoyamadev",
		options: FetchZennArticlesOptions = {}
	): Promise<PostData[]> => {
		// ✅ データ取得のみキャッシュ（純粋なAPI取得）
		return await getCachedZennArticles(username, options);
	}
);

/**
 * Zenn記事をプリロードする関数
 *
 * フェッチを早期に開始し、ウォーターフォールを防ぐために使用。
 * awaitせずに呼び出すことで、バックグラウンドでフェッチを開始する。
 *
 * @param username - Zennユーザー名
 * @param options - 取得オプション
 */
export const preloadZennArticles = (
	username: string = "aoyamadev",
	options: FetchZennArticlesOptions = {}
) => {
	void getZennArticles(username, options); // Promiseを開始するだけ（awaitしない）
};
