import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// import { getUserStatus } from "@/utils/userStatus";

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

// タイムアウト付きfetch関数
const fetchWithTimeout = async (
  url: string,
  timeout: number = 8000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ZennBot/1.0)",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export async function GET(request: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "aoyamadev";
  const limitParam = searchParams.get("limit");
  const hasLimit = limitParam !== null;
  const limit = hasLimit ? parseInt(limitParam, 10) : 0;
  const updateUserData = searchParams.get("updateUser") === "true";

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

    console.log(`Zenn API呼び出し開始: ${username}`);
    const response = await fetchWithTimeout(apiUrl);

    if (!response.ok) {
      console.error(
        `Zenn API error: ${response.status} ${response.statusText}`
      );
      throw new Error(`Zenn API error: ${response.status}`);
    }

    const data: ZennApiResponse = await response.json();
    console.log(`Zenn API応答受信: ${data.articles?.length || 0}件の記事`);

    // 記事が存在しない場合の早期リターン
    if (!data.articles || data.articles.length === 0) {
      const elapsedTime = Date.now() - startTime;
      console.log(`記事が見つかりませんでした。処理時間: ${elapsedTime}ms`);

      return NextResponse.json(
        {
          success: false,
          error: "記事が見つかりませんでした",
        },
        {
          headers: CACHE_HEADERS,
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
        console.warn("ユーザーデータ更新エラー:", dbError);
      }
    }

    const elapsedTime = Date.now() - startTime;
    console.log(`Zenn API処理完了。処理時間: ${elapsedTime}ms`);

    return NextResponse.json(
      {
        success: true,
        articles,
        totalCount: data.articles.length,
        user: userData,
      },
      {
        headers: CACHE_HEADERS,
      }
    );
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error("Zenn APIエラー:", error, `処理時間: ${elapsedTime}ms`);

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
