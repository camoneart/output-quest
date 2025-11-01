import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getZennArticles } from "@/features/zenn/_lib/fetcher";
import { PlatformType } from "@/features/posts/types";
import * as Posts from "@/features/posts/components/index";
import styles from "./ZennPosts.module.css";

/**
 * ZennPosts (Server Component)
 *
 * Zenn記事一覧を表示するServer Component
 * ItemCardListと同じパターンで2層分離
 *
 * データフェッチ:
 * - auth() でユーザー認証
 * - prisma でzennUsername取得
 * - getZennArticles() で記事取得（Request Memoization + "use cache"）
 */
const ZennPosts = async () => {
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

		return (
			<div className={styles["posts-container"]}>
				<div className={`${styles["posts-header"]}`}>
					<p>Zennの記事を「これまでの学び」として記録する場所。</p>
					<p>
						Zennで投稿した記事が一覧表示され、学びの記録として振り返ることができます。
					</p>
				</div>

				<hr className={styles["posts-container-line"]} />

				<Posts.PostsList postsData={postsData} />
			</div>
		);
	} catch (error) {
		console.error("Zenn記事の取得エラー:", error);
		return (
			<div className={styles["posts-container"]}>
				<div className={styles["error-message"]}>
					Zennの記事データの取得中にエラーが発生しました。
				</div>
			</div>
		);
	}
};

export default ZennPosts;
