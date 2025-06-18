"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import styles from "./PartyMemberDetail.module.css";
import * as PartyMember from "@/features/partyMember/components/index";
import {
	heroLevelAndMemberRelation,
	isAcquiredByHeroLevel,
	customMemberNames,
	customMemberDescriptions,
} from "@/features/party/data/partyMemberData";
import { fetchZennArticles } from "@/features/posts/services";

interface PartyMemberDetailProps {
	partyId: number;
}

// レア度を判定する関数
const getMemberRarityType = (
	partyId: number
): "normal" | "rare" | "superRare" => {
	if (partyId === 30) return "superRare";
	if (partyId > 12) return "rare";
	return "normal";
};

const PartyMemberDetail: React.FC<PartyMemberDetailProps> = ({ partyId }) => {
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
		!isGuestUser && isAcquiredByHeroLevel(partyId, currentLevel);

	// 仲間を獲得するために必要なレベル
	const requiredLevel = heroLevelAndMemberRelation[partyId] || partyId;

	// レベル差を計算（マイナスにならないようにする）
	const levelDifference = Math.max(0, requiredLevel - currentLevel);

	// 仲間の名前と説明文を取得
	const memberName = isAcquired
		? customMemberNames[partyId] || `勇者の仲間${partyId}`
		: null;
	const memberDescription = isAcquired
		? customMemberDescriptions[partyId] || `これは${memberName}の説明です。`
		: null;

	// レア度を取得
	const rarityType = getMemberRarityType(partyId);

	return (
		<div className={styles["party-member-content"]}>
			<div className={styles["party-member-card"]}>
				<div className={styles["party-member-card-content"]}>
					<div className={styles["party-member-image-box"]}>
						{isLoading ? (
							<div className={styles["loading-indicator"]}>読み込み中...</div>
						) : isAcquired ? (
							<Image
								src={`/images/party-page/acquired-icon/party-member-${partyId}.svg`}
								alt={memberName || "勇者の仲間"}
								width={60}
								height={60}
								priority={true}
								className={`${styles["party-member-image"]} ${
									styles[`party-member-image-${partyId}`]
								}`}
							/>
						) : (
							<Image
								src="/images/party-page/unacquired-icon/mark_question.svg"
								alt="まだ見ぬ仲間"
								width={60}
								height={60}
								priority={true}
								className={styles["party-member-unknown-image"]}
							/>
						)}
					</div>

					<div className={styles["party-member-title-box"]}>
						<h2 className={styles["party-member-title"]}>
							{isLoading ? (
								<div className={styles["loading-indicator"]}>読み込み中...</div>
							) : isAcquired ? (
								memberName
							) : (
								"まだ見ぬ仲間"
							)}
						</h2>
					</div>

					{isLoading ? null : isAcquired ? (
						<>
							<div className={styles["party-member-description-box"]}>
								<p className={styles["party-member-description"]}>
									{memberDescription}
								</p>
							</div>

							<div className={styles["party-member-rarity-box"]}>
								<h3 className={styles["party-member-rarity-title"]}>レア度</h3>
								<div className={styles["party-member-rarity-stars"]}>
									{rarityType === "normal" &&
										PartyMember.PartyMemberRarityStar.normal}
									{rarityType === "rare" &&
										PartyMember.PartyMemberRarityStar.rare}
									{rarityType === "superRare" &&
										PartyMember.PartyMemberRarityStar.superRare}
								</div>
							</div>
						</>
					) : (
						<div className={styles["party-member-locked-message-box"]}>
							{isGuestUser ? (
								<p className={styles["party-member-locked-message-text"]}>
									ログインすると勇者の仲間に加わったキャラクターの詳細情報がここに表示されます。
								</p>
							) : (
								<>
									<p className={styles["party-member-locked-message-text"]}>
										このキャラはLv{requiredLevel}で仲間に加わるぞ！
									</p>
									<p className={styles["party-member-locked-message-text"]}>
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

export default PartyMemberDetail;
