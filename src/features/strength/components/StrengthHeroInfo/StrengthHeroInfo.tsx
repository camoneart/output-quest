"use client";

import React, { useState, useEffect } from "react";
import styles from "./StrengthHeroInfo.module.css";
import Image from "next/image";
import { strengthHeroData } from "@/features/strength/data/strengthHeroData";
import { fetchZennArticles } from "@/features/posts/services";

const StrengthHeroInfo = () => {
	// Zenn記事データと勇者情報の状態
	const [heroData, setHeroData] = useState({
		...strengthHeroData,
		level: 1, // 初期値は1に設定
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [zennUsername, setZennUsername] = useState<string>("");

	// 記事データを取得してレベルを設定
	useEffect(() => {
		const getZennArticlesCount = async () => {
			try {
				setLoading(true);
				// 連携済みユーザー情報を取得
				const userRes = await fetch("/api/user");
				const userData = await userRes.json();
				if (!userData.success) {
					throw new Error("ユーザー情報の取得に失敗しました");
				}
				// zennUsernameが設定されている場合はそれを使用、そうでなければaoyamadevをフォールバック
				const username = userData.user.zennUsername || "aoyamadev";

				// Zennユーザー名を設定
				if (userData.user.zennUsername) {
					setZennUsername(`@${userData.user.zennUsername}`);
				} else {
					// デフォルトは@aoyamadev
					setZennUsername("@aoyamadev");
				}

				// Zenn記事数を取得（全件取得）
				const articles = await fetchZennArticles(username, { fetchAll: true });
				const articlesCount = articles.length;
				// 1投稿で1レベル上がるようにし、経験値は固定
				const calculatedLevel = articlesCount;
				const currentExp = 40;
				const nextLevelExp = 100;
				const remainingArticles = 1;
				setHeroData({
					...strengthHeroData,
					level: calculatedLevel,
					currentExp,
					nextLevelExp,
					remainingArticles,
				});
			} catch (err) {
				console.error("Zenn記事の取得エラー:", err);
				setError(
					err instanceof Error
						? err.message
						: "Zennの記事データの取得中にエラーが発生しました。"
				);
				// エラー時はデフォルト値を使用
				setZennUsername("@aoyamadev");
			} finally {
				setLoading(false);
			}
		};

		getZennArticlesCount();
	}, []);

	// 経験値の進捗率をパーセンテージで計算
	const expProgressPercent = loading
		? 0
		: (heroData.currentExp / heroData.nextLevelExp) * 100;

	if (error) {
		return (
			<div className={styles["strength-hero-info"]}>
				<div className={styles["strength-hero-info-content"]}>
					<h2 className={styles["strength-hero-info-title"]}>
						~ 勇者のレベル ~
					</h2>
					<div className={styles["error-text"]}>{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles["strength-hero-info"]}>
			<div className={styles["strength-hero-info-content"]}>
				<h2 className={styles["strength-hero-info-title"]}>~ 勇者のレベル ~</h2>
				<div className={styles["strength-hero-info-content-head"]}>
					{/* 勇者のアイコン　*/}
					<div className={styles["strength-hero-box"]}>
						<div className={styles["strength-hero-icon-box"]}>
							<Image
								src="/images/common/character_yusha_01_red.png"
								alt="勇者のアイコン"
								width={50}
								height={50}
								priority={true}
								className={styles["strength-hero-icon-image"]}
							/>
						</div>
						<div className={styles["strength-hero-name-box"]}>
							<h3 className={`${styles["strength-hero-name"]}`}>
								{heroData.name}
								{loading ? "(...)" : `(${zennUsername})`}
							</h3>
						</div>
					</div>
					{/* レベル表示 */}
					<div className={styles["strength-level-info"]}>
						<div className={`${styles["strength-level-display-container"]}`}>
							<div className={`${styles["strength-level-display-box"]}`}>
								<div className={`${styles["strength-level-display"]}`}>
									<span className={`${styles["strength-level-display-text"]}`}>
										Lv
									</span>
									<span className={`${styles["strength-level-display-value"]}`}>
										{loading ? (
											<div className={styles["loading-indicator"]}>...</div>
										) : (
											heroData.level
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* 経験値バー */}
				<div className={styles["strength-level-progress-info"]}>
					<div className={`${styles["strength-level-progress-box"]}`}>
						<div className={`${styles["strength-level-progress-content"]}`}>
							<span className={`${styles["strength-level-progress-text"]}`}>
								次のレベルまで：
							</span>
							<div
								className={`${styles["strength-level-progress-info-remaining-articles"]}`}
							>
								{loading ? (
									<div className={styles["loading-indicator-small"]}>...</div>
								) : (
									<em
										className={`${styles["strength-level-progress-info-remaining-articles-em"]}`}
									>
										{heroData.remainingArticles}
									</em>
								)}
								<span
									className={`${styles["strength-level-progress-info-remaining-articles-unit"]}`}
								>
									記事
								</span>
							</div>
						</div>
						<div className={`${styles["strength-level-progress-gauge-container"]}`}>
							<Image
								src="/images/dashboard/exp.svg"
								alt="EXP"
								width={35}
								height={35}
								className={`${styles["strength-level-progress-exp-icon"]}`}
							/>
							<div className={`${styles["strength-level-progress-gauge-box"]}`}>
								<div
									className={`${styles["strength-level-progress-gauge"]}`}
									style={{ width: `${expProgressPercent}%` }}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StrengthHeroInfo;
