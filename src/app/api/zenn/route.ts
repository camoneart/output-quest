import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// import { getUserStatus } from "@/utils/userStatus";

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

// 記事データを変換する関数
const transformZennArticle = async (article: ZennApiArticle) => {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "aoyamadev";
  const limitParam = searchParams.get("limit");
  const hasLimit = limitParam !== null;
  const limit = hasLimit ? parseInt(limitParam, 10) : 0; // limitパラメータがない場合は制限なし
  const updateUserData = searchParams.get("updateUser") === "true";

  try {
    const apiUrl = `https://zenn.dev/api/articles?username=${encodeURIComponent(
      username
    )}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Zenn API error: ${response.status}`);
    }

    const data: ZennApiResponse = await response.json();

    // デバッグ用に最初の記事データを出力
    if (data.articles && data.articles.length > 0) {
      console.log(
        "Zenn API 最初の記事データ:",
        JSON.stringify(data.articles[0], null, 2)
      );
    }

    // 記事を最新順に並べる
    const sortedArticles = [...data.articles].sort((a, b) => {
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    });

    // 制限があれば適用、なければ全件使用
    const limitedArticles =
      hasLimit && limit > 0 ? sortedArticles.slice(0, limit) : sortedArticles;

    // 各記事の詳細情報を順番に取得（非同期処理）
    const articlesPromises = limitedArticles.map((article) => {
      return transformZennArticle(article);
    });
    const articles = await Promise.all(articlesPromises);

    // ログインユーザーの情報を更新（オプション）
    let userData = null;
    if (updateUserData) {
      const { userId } = await auth();
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { clerkId: userId },
        });

        if (user) {
          // Zennユーザー名が一致する場合のみ更新
          if (user.zennUsername === username) {
            const articleCount = data.articles.length;
            // 記事数とレベルを更新（1記事＝1レベル）
            const updatedUser = await prisma.user.update({
              where: { clerkId: userId },
              data: {
                zennArticleCount: articleCount,
                level: articleCount,
              },
            });

            userData = {
              ...updatedUser,
              // ステータス名だけ必要ならここで取得
              // statusInfo: getUserStatus(articleCount),
            };
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      articles,
      totalCount: data.articles.length,
      user: userData,
    });
  } catch (error) {
    console.error("Zenn APIエラー:", error);
    return NextResponse.json(
      { success: false, error: "Zenn記事データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
