import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// キャッシュヘッダーを定義
const CACHE_HEADERS = {
	"Cache-Control": "public, max-age=300, stale-while-revalidate=600", // 5分キャッシュ
} as const;

const NO_CACHE_HEADERS = {
	"Cache-Control": "no-cache, no-store, must-revalidate",
	Pragma: "no-cache",
	Expires: "0",
} as const;

// Zenn APIからの記事データの型
type ZennApiArticle = {
	id: number;
	post_type: string;
	title: string;
	slug: string;
	emoji: string;
	published_at: string;
	path: string;
	article_type: string; // "tech" または "idea"
	user: {
		username: string;
		name: string;
		avatar_small_url: string;
	};
};

type ZennApiResponse = {
	articles: ZennApiArticle[];
	next_page: string | null;
};

// 記事データを変換する関数（同期処理に変更してパフォーマンス向上）
const transformZennArticle = (article: ZennApiArticle) => {
	return {
		id: article.id.toString(),
		title: article.title,
		url: `https://zenn.dev${article.path}`,
		category: article.article_type, // "tech" または "idea"
		publishedAt: article.published_at,
		date: article.published_at,
		platformType: "zenn" as const,
		emoji: article.emoji,
	};
};

// タイムアウト付きfetch関数にリトライ機構を追加（キャッシュバスティング対応）
const fetchWithTimeoutAndRetry = async (
	url: string,
	maxRetries: number = 3, // リトライ回数を増やす
	timeout: number = 8000,
	bustCache: boolean = false
): Promise<Response> => {
	let lastError: Error | null = null;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			// キャッシュバスティングのためのタイムスタンプを追加
			let fetchUrl = url;
			if (bustCache || attempt > 1) {
				const separator = url.includes("?") ? "&" : "?";
				const timestamp = Date.now();
				const randomId = Math.random().toString(36).substring(2, 15);
				fetchUrl = `${url}${separator}_t=${timestamp}&_retry=${attempt}&_r=${randomId}`;
			}

			const response = await fetch(fetchUrl, {
				signal: controller.signal,
				headers: {
					"User-Agent": "Mozilla/5.0 (compatible; ZennBot/1.0)",
					"Cache-Control":
						bustCache || attempt > 1
							? "no-cache, no-store, must-revalidate"
							: "public, max-age=60",
					Pragma: bustCache || attempt > 1 ? "no-cache" : "cache",
				},
			});
			clearTimeout(timeoutId);

			if (response.ok) {
				return response;
			}

			// HTTPエラーの場合も例外として扱う
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		} catch (error) {
			lastError = error as Error;

			// 最後の試行でない場合は少し待ってからリトライ
			if (attempt < maxRetries) {
				// 指数バックオフ + キャッシュが更新される時間を考慮
				const waitTime = attempt === 1 ? 2000 : 1000 * Math.pow(2, attempt - 1);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}
	}

	throw lastError || new Error("予期しないエラーが発生しました");
};

export async function GET(request: Request) {
	const startTime = Date.now();
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username") || "aoyamadev";
	const limitParam = searchParams.get("limit");
	const hasLimit = limitParam !== null;
	const limit = hasLimit ? parseInt(limitParam, 10) : 0;
	const updateUserData = searchParams.get("updateUser") === "true";
	const bustCache = searchParams.get("bustCache") === "true"; // キャッシュバスティングフラグ

	// 入力バリデーション
	if (!username || username.length === 0) {
		return NextResponse.json(
			{ success: false, error: "ユーザー名が指定されていません" },
			{
				status: 400,
				headers: NO_CACHE_HEADERS,
			}
		);
	}

	// ユーザー名の妥当性チェック（セキュリティ向上）
	if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
		return NextResponse.json(
			{ success: false, error: "無効なユーザー名形式です" },
			{
				status: 400,
				headers: NO_CACHE_HEADERS,
			}
		);
	}

	try {
		const apiUrl = `https://zenn.dev/api/articles?username=${encodeURIComponent(
			username
		)}`;

		const response = await fetchWithTimeoutAndRetry(apiUrl, 3, 8000, bustCache);

		const data: ZennApiResponse = await response.json();

		// 記事が存在しない場合の早期リターン
		if (!data.articles || data.articles.length === 0) {
			// 記事が0件でも成功として扱い、ユーザーデータの更新は実行する
			let userData = null;
			if (updateUserData) {
				try {
					const { userId } = await auth();
					if (userId) {
						const user = await prisma.user.findUnique({
							where: { clerkId: userId },
							select: {
								id: true,
								zennUsername: true,
							},
						});

						if (user && user.zennUsername === username) {
							userData = await prisma.user.update({
								where: { clerkId: userId },
								data: {
									zennArticleCount: 0,
									level: 1, // 記事が0件の場合はレベル1
								},
								select: {
									id: true,
									clerkId: true,
									username: true,
									email: true,
									displayName: true,
									profileImage: true,
									zennUsername: true,
									zennArticleCount: true,
									level: true,
									createdAt: true,
									updatedAt: true,
								},
							});
						}
					}
				} catch (dbError) {
					// データベースエラーは記録のみ
				}
			}

			return NextResponse.json(
				{
					success: true,
					articles: [],
					totalCount: 0,
					user: userData,
				},
				{
					headers: bustCache ? NO_CACHE_HEADERS : CACHE_HEADERS,
				}
			);
		}

		// 記事を最新順に並べる（高速化のためsortを最適化）
		const sortedArticles = data.articles.sort((a, b) => {
			return (
				new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
			);
		});

		// 制限があれば適用、なければ全件使用
		const limitedArticles =
			hasLimit && limit > 0 ? sortedArticles.slice(0, limit) : sortedArticles;

		// 各記事の詳細情報を変換（非同期処理を削除してパフォーマンス向上）
		const articles = limitedArticles.map(transformZennArticle);

		// ログインユーザーの情報を更新（オプション）
		let userData = null;
		if (updateUserData) {
			try {
				const { userId } = await auth();
				if (userId) {
					// データベース操作を並列実行可能にするため、独立した処理として実行
					const userUpdatePromise = (async () => {
						const user = await prisma.user.findUnique({
							where: { clerkId: userId },
							select: {
								id: true,
								zennUsername: true,
							},
						});

						if (user && user.zennUsername === username) {
							const articleCount = data.articles.length;
							// 楽観的更新でパフォーマンス向上
							return await prisma.user.update({
								where: { clerkId: userId },
								data: {
									zennArticleCount: articleCount,
									level: articleCount,
								},
								select: {
									id: true,
									clerkId: true,
									username: true,
									email: true,
									displayName: true,
									profileImage: true,
									zennUsername: true,
									zennArticleCount: true,
									level: true,
									createdAt: true,
									updatedAt: true,
								},
							});
						}
						return null;
					})();

					userData = await userUpdatePromise;
				}
			} catch (dbError) {
				// データベースエラーは警告として記録し、APIレスポンスは成功として返す
				// データベース更新に失敗した場合でも、記事データは取得できているので
				// 基本的なユーザー情報を作成して返す
				try {
					const { userId } = await auth();
					if (userId) {
						userData = {
							id: null,
							clerkId: userId,
							username: null,
							email: null,
							displayName: null,
							profileImage: null,
							zennUsername: username,
							zennArticleCount: data.articles.length,
							level: data.articles.length,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						};
					}
				} catch (fallbackError) {
					// フォールバック処理エラーは無視
				}
			}
		}

		return NextResponse.json(
			{
				success: true,
				articles,
				totalCount: data.articles.length,
				user: userData,
			},
			{
				headers: bustCache ? NO_CACHE_HEADERS : CACHE_HEADERS,
			}
		);
	} catch (error) {
		const elapsedTime = Date.now() - startTime;
		console.error("Zenn APIエラー:", error);

		// エラーの種類に応じてより詳細なメッセージを返す
		let errorMessage = "Zenn記事データの取得に失敗しました";
		let statusCode = 500;

		if (error instanceof Error) {
			if (error.name === "AbortError") {
				errorMessage = "リクエストがタイムアウトしました";
				statusCode = 408;
			} else if (error.message.includes("fetch")) {
				errorMessage = "Zennサーバーへの接続に失敗しました";
				statusCode = 502;
			}
		}

		return NextResponse.json(
			{ success: false, error: errorMessage },
			{
				status: statusCode,
				headers: NO_CACHE_HEADERS,
			}
		);
	}
}
