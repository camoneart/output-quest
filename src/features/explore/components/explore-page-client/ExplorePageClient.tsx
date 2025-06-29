"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useChat } from "@ai-sdk/react";
import styles from "./ExplorePageClient.module.css";
import * as Explore from "@/features/explore/components";
import { fetchZennArticles } from "@/features/posts/services";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import Image from "next/image";

const ExplorePageClient = () => {
	const { user, isLoaded } = useUser();
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	const { messages, append, status, setMessages } = useChat({
		api: "/api/ai/analyze-articles",
		body: {}, // 初期化
		onError: (error) => {
			console.error("AI探索エラー:", error);
			setError("記事を探索できませんでした。再度お試しください。");
			setIsAnalyzing(false);
		},
		onFinish: () => {
			setIsAnalyzing(false);
		},
	});

	// ゲストユーザーまたはZenn未連携の場合
	const isGuestUser = !isLoaded || !user || !userZennInfo?.zennUsername;

	const handleAnalyzeArticles = async () => {
		if (isGuestUser || !userZennInfo?.zennUsername) {
			setError("Zenn連携が必要です。");
			return;
		}

		playClickSound();

		// 前回の探索結果をリセット
		setMessages([]);
		setIsAnalyzing(true);
		setError(null);

		try {
			// Zenn記事を取得
			const articles = await fetchZennArticles(userZennInfo.zennUsername, {
				fetchAll: true,
			});

			if (articles.length === 0) {
				setError("探索する記事がありません。");
				setIsAnalyzing(false);
				return;
			}

			// AI探索を実行
			await append(
				{
					role: "user",
					content: "記事探索を開始します",
				},
				{
					body: {
						articles: articles.map((article) => ({
							title: article.title,
							url: article.url,
							category: article.category,
							publishedAt: article.publishedAt,
							emoji: article.emoji,
						})),
						username: userZennInfo.zennUsername,
					},
				}
			);
		} catch (err) {
			console.error("記事取得エラー:", err);
			setError("記事の取得に失敗しました。");
			setIsAnalyzing(false);
		}
	};

	// ユーザーのZenn連携情報を取得
	useEffect(() => {
		const fetchUserZennInfo = async () => {
			if (!isLoaded) {
				setIsZennInfoLoaded(false);
				return;
			}

			if (!user) {
				setUserZennInfo(null);
				setIsZennInfoLoaded(true);
				return;
			}

			setIsZennInfoLoaded(false);

			try {
				const userRes = await fetch("/api/user");
				const userData = await userRes.json();

				if (userData.success) {
					setUserZennInfo(userData.user);
				} else {
					setUserZennInfo(null);
				}
			} catch (err) {
				console.error("ユーザー情報取得エラー:", err);
				setUserZennInfo(null);
			} finally {
				setIsZennInfoLoaded(true);
			}
		};

		fetchUserZennInfo();
	}, [isLoaded, user?.id]);

	return (
		<>
			<h1 className={`${styles["explore-title"]}`}>記事探索</h1>
			<div className={`${styles["explorer-container"]}`}>
				<div className={`${styles["explorer-header"]}`}>
					<div className={styles["explorer-header-content"]}>
						<div className="grid gap-[5px] place-items-center lg:place-items-start">
							<p>
								AIが勇者の仲間の「賢者」として、次に書く記事に最適なテーマを提案。
							</p>
							<p>
								賢者（AI）は、あなたのZenn記事を探索し、過去の投稿から傾向を探ることで、
							</p>
							<p>あなたの成長に最適な「学びのタネ」を見つけ出します。</p>
						</div>

						{!isLoaded || !isZennInfoLoaded ? (
							<p className="grid place-items-center px-4">読み込み中...</p>
						) : !isGuestUser ? (
							<div className={styles["explore-analysis-controls"]}>
								<button
									onClick={handleAnalyzeArticles}
									disabled={isAnalyzing || status === "streaming"}
									className={`${styles["explore-analyze-button"]} ${
										isAnalyzing || status === "streaming"
											? styles["explore-analyzing"]
											: ""
									}`}
								>
									<span className={styles["explore-analyze-button-text"]}>
										<Image
											src="/images/icon/explore-btn-icon.svg"
											alt="探索する"
											width={18}
											height={18}
											className={styles["explore-analyze-button-icon"]}
										/>
										{isAnalyzing || status === "streaming" ? (
											<span>探索中...</span>
										) : (
											<span>探索する</span>
										)}
									</span>
								</button>
							</div>
						) : (
							<div className={styles["explore-analysis-controls"]}>
								<div
									className={`${styles["explore-analyze-button"]} ${styles["explore-guest-message"]}`}
								>
									<span className={styles["explore-analyze-button-text"]}>
										<Image
											src="/images/icon/explore-btn-icon.svg"
											alt="探索する"
											width={18}
											height={18}
											className={styles["explore-analyze-button-icon"]}
										/>
										<span>ログインが必要</span>
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<hr className={styles["explorer-line"]} />

				<Explore.ExploreArticleAnalysis
					userZennInfo={userZennInfo}
					isLoaded={isLoaded}
					isZennInfoLoaded={isZennInfoLoaded}
					messages={messages}
					status={status}
					isAnalyzing={isAnalyzing}
					error={error}
				/>
			</div>
		</>
	);
};

export default ExplorePageClient;
