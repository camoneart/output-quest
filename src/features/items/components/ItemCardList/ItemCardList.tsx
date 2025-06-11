"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ItemCardList.module.css";
import * as Items from "@/features/items/components/index";
import { updateItemsByLevel } from "@/features/items/data/itemsData";
import { fetchZennArticles } from "@/features/posts/services";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { Item } from "@/features/items/types/items.types";
import { useUser } from "@clerk/nextjs";

const ItemCardList: React.FC = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	// ゲストユーザーかどうかの判定（Clerkサインイン + Zenn連携の両方が必要）
	const isGuestUser = !isLoaded || !user || !userZennInfo?.zennUsername;

	// ユーザーのZenn連携情報を取得
	useEffect(() => {
		const fetchUserZennInfo = async () => {
			if (!isLoaded || !user) {
				setUserZennInfo(null);
				return;
			}

			try {
				const response = await fetch("/api/user");
				const data = await response.json();

				if (data.success && data.user) {
					setUserZennInfo({ zennUsername: data.user.zennUsername });
				} else {
					setUserZennInfo(null);
				}
			} catch (err) {
				console.error("ユーザー情報取得エラー:", err);
				setUserZennInfo(null);
			}
		};

		fetchUserZennInfo();
	}, [isLoaded, user]);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true);
				const userRes = await fetch("/api/user");
				const userData = await userRes.json();
				if (!userData.success) {
					throw new Error("ユーザー情報の取得に失敗しました");
				}
				const username = userData.user.zennUsername || "aoyamadev";

				const articles = await fetchZennArticles(username, { fetchAll: true });
				const articleCount = articles.length;
				const updatedItems = updateItemsByLevel(articleCount);
				setItems(updatedItems);
			} catch (err) {
				console.error("アイテムデータ取得エラー:", err);
				setError(
					err instanceof Error
						? err.message
						: "アイテムデータの取得に失敗しました。"
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchItems();
	}, []);

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	if (isLoading) {
		return (
			<div className={styles["items-loading-indicator"]}>読み込み中...</div>
		);
	}
	if (error) {
		return <p className={styles["error-message"]}>{error}</p>;
	}

	return (
		<div className={styles["items-grid"]}>
			{items.map((item) => (
				<div className={`${styles["item-card-content"]}`} key={item.id}>
					<Link
						href={`/items/${item.id}`}
						className={styles["item-card"]}
						onClick={(e) => handleNavigation(e, `/items/${item.id}`)}
					>
						{isGuestUser ? (
							<div className={styles["unacquired-item-icon"]}>
								<Items.ItemsTreasureChestIcon
									width={40}
									height={40}
									className={styles["unacquired-item-icon-image"]}
								/>
							</div>
						) : item.acquired ? (
							<div className={styles["acquired-item-icon"]}>
								<Image
									src={`/images/items-page/acquired-icon/item-${item.id}.svg`}
									alt={item.name || "アイテム"}
									width={40}
									height={40}
									className={`${styles["acquired-item-icon-image"]} ${
										styles[`acquired-item-icon-image-${item.id}`]
									}`}
								/>
							</div>
						) : (
							<div className={styles["unacquired-item-icon"]}>
								<Items.ItemsTreasureChestIcon
									width={40}
									height={40}
									className={styles["unacquired-item-icon-image"]}
								/>
							</div>
						)}
						<h2 className={styles["item-name"]}>
							{isGuestUser || !item.acquired ? "???" : item.name}
						</h2>
					</Link>
				</div>
			))}
		</div>
	);
};

export default ItemCardList;
