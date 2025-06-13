"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardHeroSection.module.css";
import Link from "next/link";
import Image from "next/image";
import { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { useRouter } from "next/navigation";
import { useHero } from "@/contexts/HeroContext";
import { useUser } from "@clerk/nextjs";
import XShareButton from "@/components/common/XShareButton/XShareButton";

type DashboardHeroSectionProps = {
	dashboardData: DashboardData;
};

const DashboardHeroSection = ({ dashboardData }: DashboardHeroSectionProps) => {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const { heroData, isLoading, error } = useHero();
	const [zennUsername, setZennUsername] = useState<string>("");
	const [isZennUsernameLoaded, setIsZennUsernameLoaded] = useState(false);
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);

	// 経験値ゲージを常に40%表示に固定
	const expProgressPercent = isLoading ? 0 : 40;

	// 次のレベルまでの残り記事数は常に1
	const remainingArticles = 1;

	// ゲストユーザーの判定
	const isGuestUser = !isLoaded || !user || !userZennInfo?.zennUsername;

	// Zennユーザー名を取得
	useEffect(() => {
		const fetchZennUsername = async () => {
			try {
				if (!isLoaded) {
					setIsZennInfoLoaded(false);
					return;
				}

				if (!user) {
					setUserZennInfo(null);
					setIsZennInfoLoaded(true);
					setZennUsername("@aoyamadev");
					setIsZennUsernameLoaded(true);
					return;
				}

				setIsZennInfoLoaded(false);

				const userRes = await fetch("/api/user");
				const userData = await userRes.json();

				if (userData.success) {
					setUserZennInfo(userData.user);
					if (userData.user.zennUsername) {
						setZennUsername(`@${userData.user.zennUsername}`);
					} else {
						// デフォルトは@aoyamadev
						setZennUsername("@aoyamadev");
					}
				} else {
					setUserZennInfo(null);
					// デフォルトは@aoyamadev
					setZennUsername("@aoyamadev");
				}
			} catch (error) {
				console.error("Zennユーザー名取得エラー:", error);
				setUserZennInfo(null);
				// エラー時はデフォルト値を使用
				setZennUsername("@aoyamadev");
			} finally {
				setIsZennUsernameLoaded(true);
				setIsZennInfoLoaded(true);
			}
		};

		fetchZennUsername();
	}, [isLoaded, user?.id]);

	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});

	// 遅延付きページ遷移の処理
	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	// 表示するレベル値を決定（HeroContextから取得）
	const displayLevel = isLoading
		? dashboardData.heroData.level
		: heroData.level;

	return (
		<section className={`${styles["hero-info-section"]}`}>
			<h2 className={`${styles["hero-info-title"]}`}>~ 勇者のレベル ~</h2>
			<div className={`${styles["hero-info-container"]}`}>
				{/* キャラクター情報 */}
				<div className={`${styles["hero-info"]}`}>
					<div className={`${styles["hero-info-box"]}`}>
						<div className={`${styles["hero-info-icon-box"]}`}>
							<Link
								href={"/strength/"}
								className={`${styles["hero-info-icon"]}`}
								onClick={(e) => handleNavigation(e, "/strength/")}
							>
								<Image
									src={`/images/common/character_yusha_01_red.png`}
									alt={dashboardData.heroData.name}
									width={55}
									height={55}
									priority={true}
									className={`${styles["hero-info-icon-image"]}`}
								/>
							</Link>
						</div>
						<div className={styles["hero-info-name-box"]}>
							<h3 className={`${styles["hero-info-name"]}`}>
								{dashboardData.heroData.name}
								{!isZennUsernameLoaded ? "(...)" : `(${zennUsername})`}
							</h3>
						</div>
					</div>
					<div className={`${styles["hero-info-level"]}`}>
						<div className={`${styles["hero-info-level-header"]}`}>
							{/* レベル表示 */}
							<div className={`${styles["hero-info-level-display-container"]}`}>
								<div className={`${styles["hero-info-level-display-box"]}`}>
									<div className={`${styles["hero-info-level-display"]}`}>
										<span
											className={`${styles["hero-info-level-display-text"]}`}
										>
											Lv
										</span>
										<span
											className={`${styles["hero-info-level-display-value"]}`}
										>
											{isLoading ? (
												<div className={styles["loading-indicator"]}>...</div>
											) : error ? (
												<div className={styles["error-value"]}>1</div>
											) : (
												displayLevel
											)}
										</span>
									</div>
								</div>
							</div>
							{/* Xへのシェアリンク */}
							<XShareButton
								level={displayLevel}
								username={zennUsername || "@aoyamadev"}
								className={`${styles["hero-info-share-link"]}`}
								iconWrapClassName={`${styles["hero-info-share-icon-wrap"]}`}
								iconClassName={`${styles["hero-info-share-icon"]}`}
								textClassName={`${styles["hero-info-share-link-text"]}`}
								iconWidth={11}
								iconHeight={11}
								isGuestUser={isGuestUser}
							/>
						</div>
						{/* レベルアップ情報 */}
						<div className={`${styles["hero-info-level-progress-box"]}`}>
							<div className={`${styles["hero-info-level-progress-text-box"]}`}>
								<span className={`${styles["hero-info-level-progress-text"]}`}>
									次のレベルまで：
								</span>
								<div
									className={`${styles["hero-info-level-progress-value-info"]}`}
								>
									{isLoading ? (
										<div className={styles["loading-indicator-small"]}>...</div>
									) : (
										<em
											className={`${styles["hero-info-level-progress-value"]}`}
										>
											{remainingArticles}
										</em>
									)}
									<span
										className={`${styles["hero-info-level-progress-unit"]}`}
									>
										記事
									</span>
								</div>
							</div>
							<div
								className={`${styles["hero-info-level-progress-gauge-box"]}`}
							>
								<div
									className={`${styles["hero-info-level-progress-gauge"]}`}
									style={{
										width: `${expProgressPercent}%`,
									}}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DashboardHeroSection;
