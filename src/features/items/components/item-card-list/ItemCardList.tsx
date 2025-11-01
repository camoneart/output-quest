import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fetchZennArticles } from "@/features/posts/services";
import { updateItemsByLevel } from "@/features/items/data/itemsData";
import ItemCardListClient from "../item-card-list-client/ItemCardListClient";
import styles from "./ItemCardList.module.css";

const ItemCardList = async () => {
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

		// アイテムデータを更新
		const items = updateItemsByLevel(articleCount);

		// Client Componentにデータを渡す
		return <ItemCardListClient items={items} isGuestUser={isGuestUser} />;
	} catch (error) {
		console.error("アイテムデータ取得エラー:", error);
		return (
			<p className={styles["error-message"]}>
				アイテムデータの取得に失敗しました。
			</p>
		);
	}
};

export default ItemCardList;
