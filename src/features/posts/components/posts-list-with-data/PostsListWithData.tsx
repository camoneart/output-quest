import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getZennArticles } from "@/features/zenn/_lib/fetcher";
import { PlatformType } from "@/features/posts/types";
import PostsList from "../posts-list/PostsList";
import styles from "./PostsListWithData.module.css";

/**
 * PostsListWithData (Server Component)
 *
 * データフェッチとPostsList表示を担当
 * ZennPostsから分離されたデータ取得ロジック
 *
 * データフェッチ:
 * - auth() でユーザー認証
 * - prisma でzennUsername取得
 * - getZennArticles() で記事取得（Request Memoization + "use cache"）
 */
const PostsListWithData = async () => {
	try {
		// 認証情報を取得
		const { userId } = await auth();

		// ゲストユーザーの判定
		let zennUsername = "aoyamadev"; // デフォルト値

		if (userId) {
			// 認証済みユーザーの場合、DBからzennUsernameを取得
			const user = await prisma.user.findUnique({
				where: { clerkId: userId },
				select: {
					zennUsername: true,
				},
			});

			if (user?.zennUsername) {
				zennUsername = user.zennUsername;
			}
		}

		// Zenn記事を取得（全件取得）
		const articles = await getZennArticles(zennUsername, { fetchAll: true });

		// platformType: "zenn" を各記事に設定
		const postsData = articles.map((article) => ({
			...article,
			platformType: "zenn" as PlatformType,
		}));

		return <PostsList postsData={postsData} />;
	} catch (error) {
		console.error("Zenn記事の取得エラー:", error);
		return (
			<div className={styles["error-message"]}>
				Zennの記事データの取得中にエラーが発生しました。
			</div>
		);
	}
};

export default PostsListWithData;
