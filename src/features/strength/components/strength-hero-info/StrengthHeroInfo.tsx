import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getZennArticles } from "@/features/zenn/_lib/fetcher";
import { strengthHeroData } from "@/features/strength/data/strengthHeroData";
import StrengthHeroInfoClient from "../strength-hero-info-client/StrengthHeroInfoClient";
import styles from "./StrengthHeroInfo.module.css";

/**
 * StrengthHeroInfo (Server Component)
 *
 * 勇者のレベル情報を取得してStrengthHeroInfoClientに渡す
 * ItemCardList/PartyMemberCardListと同じパターンで2層分離
 *
 * データフェッチ:
 * - auth() でユーザー認証
 * - prisma でzennUsername取得
 * - getZennArticles() で記事数取得（Request Memoization + "use cache"）
 * - レベル計算（記事数 = レベル）
 */
const StrengthHeroInfo = async () => {
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

		// Zenn記事数を取得（全件取得）
		const articles = await getZennArticles(zennUsername, { fetchAll: true });
		const articlesCount = articles.length;

		// レベル計算（1投稿 = 1レベル）
		const calculatedLevel = Math.max(articlesCount, 1); // 最低レベル1
		const currentExp = 40;
		const nextLevelExp = 100;
		const remainingArticles = 1;

		const heroData = {
			...strengthHeroData,
			level: calculatedLevel,
			currentExp,
			nextLevelExp,
			remainingArticles,
		};

		// zennUsernameの表示形式
		const displayZennUsername = `@${zennUsername}`;

		// Client Componentにデータを渡す
		return (
			<StrengthHeroInfoClient
				heroData={heroData}
				zennUsername={displayZennUsername}
			/>
		);
	} catch (error) {
		console.error("Zenn記事の取得エラー:", error);
		return (
			<div className={styles["strength-hero-info"]}>
				<div className={styles["strength-hero-info-content"]}>
					<h2 className={styles["strength-hero-info-title"]}>
						~ 勇者のレベル ~
					</h2>
					<div className={styles["error-text"]}>
						データの取得中にエラーが発生しました。
					</div>
				</div>
			</div>
		);
	}
};

export default StrengthHeroInfo;
