"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import styles from "./ItemDetailClient.module.css"; // CSSモジュールをインポート
import * as itemDetail from "@/features/itemDetail/components/index";
import {
	isAcquiredByHeroLevel,
	heroLevelAndItemRelation,
	customItemNames,
	customItemDescriptions,
} from "@/features/items/data/itemsData";
import { fetchZennArticles } from "@/features/posts/services";

interface ItemDetailClientProps {
	itemId: number;
}

// レア度を判定する関数
const getItemRarityType = (itemId: number): "normal" | "rare" | "superRare" => {
	if (itemId === 30) return "superRare";
	if (itemId > 12) return "rare";
	return "normal";
};

const ItemDetailClient: React.FC<ItemDetailClientProps> = ({ itemId }) => {
	const { user, isLoaded } = useUser();
	// Zenn連携アカウントのレベル取得状態
	const [currentLevel, setCurrentLevel] = useState<number>(1);
	const [isLoadingLevel, setIsLoadingLevel] = useState<boolean>(true);
	const [levelError, setLevelError] = useState<string | null>(null);
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);

	// ゲストユーザーの判定
	const isGuestUser = !isLoaded || !user || !userZennInfo?.zennUsername;

	useEffect(() => {
		const loadLevel = async () => {
			try {
				setIsLoadingLevel(true);

				if (!isLoaded) {
					setIsZennInfoLoaded(false);
					return;
				}

				if (!user) {
					setUserZennInfo(null);
					setIsZennInfoLoaded(true);
					setCurrentLevel(1);
					return;
				}

				setIsZennInfoLoaded(false);

				const userRes = await fetch("/api/user");
				const userData = await userRes.json();

				if (!userData.success) {
					throw new Error("ユーザー情報の取得に失敗しました");
				}

				setUserZennInfo(userData.user);

				const username = userData.user.zennUsername;
				if (!username) {
					setCurrentLevel(1);
					return;
				}

				const articles = await fetchZennArticles(username, { fetchAll: true });
				setCurrentLevel(articles.length);
			} catch (err) {
				console.error("レベル取得エラー:", err);
				setLevelError(
					err instanceof Error
						? err.message
						: "レベル取得中にエラーが発生しました。"
				);
			} finally {
				setIsLoadingLevel(false);
				setIsZennInfoLoaded(true);
			}
		};
		loadLevel();
	}, [isLoaded, user?.id]);

	// ロード中の表示
	const isLoading = !isLoaded || (user && !isZennInfoLoaded);

	if (levelError) {
		return <p className={styles["error-text"]}>{levelError}</p>;
	}

	// ゲストユーザーの場合は常に未獲得状態として表示
	const isAcquired =
		!isGuestUser && isAcquiredByHeroLevel(itemId, currentLevel);

	// アイテムを獲得するために必要なレベル
	const requiredLevel = heroLevelAndItemRelation[itemId] || itemId;

	// レベル差を計算（マイナスにならないようにする）
	const levelDifference = Math.max(0, requiredLevel - currentLevel);

	// アイテムの名前と説明文を取得
	const itemName = isAcquired
		? customItemNames[itemId] || `アイテム${itemId}`
		: null;
	const itemDescription = isAcquired
		? customItemDescriptions[itemId] || `これは${itemName}の説明です。`
		: null;

	// レア度を取得
	const rarityType = getItemRarityType(itemId);

	return (
		<div className={styles["item-detail-content"]}>
			<div className={styles["item-detail-card"]}>
				<div className={styles["item-detail-card-content"]}>
					<div className={styles["item-detail-image-box"]}>
						{isLoading ? (
							<div className={styles["loading-indicator"]}>読み込み中...</div>
						) : isAcquired ? (
							<Image
								src={`/images/items-page/acquired-icon/item-${itemId}.svg`}
								alt={itemName || "アイテム"}
								width={60}
								height={60}
								priority={true}
								className={`${styles["item-detail-image"]} ${
									styles[`item-detail-image-${itemId}`]
								}`}
							/>
						) : (
							<Image
								src="/images/items-page/unacquired-icon/treasure-chest.svg"
								alt="未獲得のアイテム"
								width={60}
								height={60}
								priority={true}
								className={styles["item-detail-unknown-icon-image"]}
							/>
						)}
					</div>

					<div className={styles["item-detail-title-box"]}>
						<h2 className={styles["item-detail-title"]}>
							{isLoading ? (
								<div className={styles["loading-indicator"]}>読み込み中...</div>
							) : isAcquired ? (
								itemName
							) : (
								"未獲得のアイテム"
							)}
						</h2>
					</div>

					{isLoading ? null : isAcquired ? (
						<>
							<div className={styles["item-detail-description-box"]}>
								<p className={styles["item-detail-description"]}>
									{itemDescription}
								</p>
							</div>

							<div className={styles["item-detail-rarity-box"]}>
								<h3 className={styles["item-detail-rarity-title"]}>レア度</h3>
								<div className={styles["item-detail-rarity-stars"]}>
									{rarityType === "normal" &&
										itemDetail.ItemDetailRarityStar.normal}
									{rarityType === "rare" &&
										itemDetail.ItemDetailRarityStar.rare}
									{rarityType === "superRare" &&
										itemDetail.ItemDetailRarityStar.superRare}
								</div>
							</div>
						</>
					) : (
						<div className={styles["item-detail-locked-message-box"]}>
							{isGuestUser ? (
								<p className={styles["item-detail-locked-message-text"]}>
									ログインすると獲得したアイテムについての詳細情報がここに表示されます。
								</p>
							) : (
								<>
									<p className={styles["item-detail-locked-message-text"]}>
										このアイテムは、Lv{requiredLevel}で獲得できるぞ！
									</p>
									<p className={styles["item-detail-locked-message-text"]}>
										Lv{requiredLevel}まで、あと{levelDifference}レベル
									</p>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ItemDetailClient;
