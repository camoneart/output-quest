"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardLatestPartyMemberSection.module.css";
import Link from "next/link";
import Image from "next/image";
import {
	heroLevelAndMemberRelation,
	customMemberNames,
	customMemberDescriptions,
} from "@/features/party/data/partyMemberData";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import { useRouter } from "next/navigation";
import { useHero } from "@/contexts/HeroContext";
import { useUser } from "@clerk/nextjs";
import XShareButton from "@/components/common/x-share-button/XShareButton";

const DashboardLatestPartyMemberSection: React.FC = () => {
	const [memberId, setMemberId] = useState<number | null>(null);
	const [isLoadingMember, setIsLoadingMember] = useState<boolean>(true);
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const { heroData, isLoading: isHeroLoading, error } = useHero();
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
		const calculateMember = () => {
			// HeroContextがまだ読み込み中の場合は待機
			if (isHeroLoading) {
				return;
			}

			try {
				setIsLoadingMember(true);

				// HeroContextから記事数（レベル）を取得
				const articleCount = heroData.level;

				const acquiredIds = Object.entries(heroLevelAndMemberRelation)
					.filter(([, reqLevel]) => articleCount >= reqLevel)
					.map(([id]) => parseInt(id, 10));

				if (acquiredIds.length > 0) {
					setMemberId(Math.max(...acquiredIds));
				} else {
					setMemberId(null);
				}
			} catch (err) {
				console.error("なかま計算エラー:", err);
			} finally {
				setIsLoadingMember(false);
			}
		};

		calculateMember();
	}, [isHeroLoading, heroData.level]); // HeroContextの状態に依存

	// 読み込み状態またはエラー時は何も表示しない
	if (isHeroLoading || isLoadingMember || error) {
		return null;
	}

	const memberName =
		memberId !== null ? customMemberNames[memberId] || "まだ見ぬ仲間" : "";
	const memberDescription =
		memberId !== null ? customMemberDescriptions[memberId] || "詳細不明" : "";

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	return (
		<section className={`${styles["party-member-section"]}`}>
			<h2 className={`${styles["party-member-title"]}`}>
				~ 最近仲間に加わったキャラクター ~
			</h2>
			<div className={`${styles["party-member-container"]}`}>
				{isGuestUser ? (
					<div className={styles["party-member-guest-user-container"]}>
						<p className={styles["party-member-guest-user-message"]}>
							ログインすると仲間の情報が表示されます。
						</p>
					</div>
				) : memberId === null ? (
					<div className={styles["party-member-null-container"]}>
						<p className={styles["party-member-null-message"]}>
							まだ仲間になったキャラクターはいません。
						</p>
					</div>
				) : (
					<div className={`${styles["party-member-box"]}`}>
						<Link
							href={`/party/${memberId}`}
							className={`${styles["party-member-link"]}`}
							onClick={(e) => handleNavigation(e, `/party/${memberId}`)}
						>
							<div className={`${styles["party-member-icon-container"]}`}>
								<div className={`${styles["party-member-icon-box"]}`}>
									<Image
										src={`/images/party-page/acquired-icon/party-member-${memberId}.svg`}
										alt={memberName}
										width={35}
										height={35}
										className={`${styles["party-member-icon"]}`}
									/>
								</div>
							</div>
							<div className={`${styles["party-member-info"]}`}>
								<h3 className={`${styles["party-member-name"]}`}>
									{memberName}
								</h3>
								<p className={`${styles["party-member-description"]}`}>
									{memberDescription}
								</p>
							</div>
						</Link>
					</div>
				)}
			</div>
			{/* Xへのシェアリンク */}
			<XShareButton
				level={heroData.level}
				username=""
				customText="最近仲間に加わったキャラをXでシェアする"
				customShareText={`【仲間が加わった！】\n\n⭐️ 勇者の仲間に「${memberName}」が加わった！\n\n`}
				className={`${styles["party-member-share-link"]}`}
				iconWrapClassName={`${styles["party-member-share-icon-wrap"]}`}
				iconClassName={`${styles["party-member-share-icon"]}`}
				textClassName={`${styles["party-member-share-link-text"]}`}
				iconWidth={11}
				iconHeight={11}
				isGuestUser={isGuestUser}
				hasContent={memberId !== null}
				noContentMessage="シェアできる仲間がいません。"
			/>
		</section>
	);
};

export default DashboardLatestPartyMemberSection;
