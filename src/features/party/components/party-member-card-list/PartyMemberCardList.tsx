import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fetchZennArticles } from "@/features/posts/services";
import { updatePartyMembersByLevel } from "@/features/party/data/partyMemberData";
import PartyMemberCardListClient from "../party-member-card-list-client/PartyMemberCardListClient";
import styles from "./PartyMemberCardList.module.css";

const PartyMemberCardList = async () => {
	try {
		// 認証情報を取得
		const { userId } = await auth();

		// ゲストユーザーの判定
		let zennUsername = "aoyamadev"; // デフォルト値
		let isGuestUser = true;

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
				isGuestUser = false;
			}
		}

		// Zenn記事を取得
		const articles = await fetchZennArticles(zennUsername, { fetchAll: true });
		const articleCount = articles.length;

		// パーティメンバーデータを更新
		const members = updatePartyMembersByLevel(articleCount);

		// Client Componentにデータを渡す
		return <PartyMemberCardListClient members={members} isGuestUser={isGuestUser} />;
	} catch (error) {
		console.error("仲間データ取得エラー:", error);
		return (
			<p className={styles["error-message"]}>
				仲間データの取得に失敗しました。
			</p>
		);
	}
};

export default PartyMemberCardList;
