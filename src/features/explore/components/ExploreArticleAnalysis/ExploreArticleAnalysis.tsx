"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import styles from "./ExploreArticleAnalysis.module.css";
import Link from "next/link";

interface ExploreArticleAnalysisProps {
	userZennInfo?: {
		zennUsername?: string;
	} | null;
	isLoaded: boolean;
	isZennInfoLoaded: boolean;
	className?: string;
	messages: any[];
	status: "error" | "submitted" | "streaming" | "ready";
	isAnalyzing: boolean;
	error: string | null;
}

const ExploreArticleAnalysis: React.FC<ExploreArticleAnalysisProps> = ({
	userZennInfo,
	isLoaded,
	isZennInfoLoaded,
	className,
	messages,
	status,
	isAnalyzing,
	error,
}) => {
	const { user } = useUser();

	// ゲストユーザーまたはZenn未連携の場合
	const isGuestUser = !isLoaded || !user || !userZennInfo?.zennUsername;

	// ローディング状態の表示
	if (!isLoaded || !isZennInfoLoaded) {
		return <p className={styles["loading-indicator"]}>読み込み中...</p>;
	}

	return (
		<div className={styles["explore-article-analysis-container"]}>
			{isGuestUser ? (
				<div className="grid place-items-center gap-2">
					<p>この機能を利用するには、Zennアカウントとの連携が必要です。</p>
					<div className="grid place-items-center gap-6">
						<p>連携ページでログインを行ってください。</p>
						<Link
							href="/connection"
							className={styles["to-the-link-page-button"]}
						>
							<span className={styles["to-the-link-page-button-text"]}>
								連携ページへ
							</span>
						</Link>
					</div>
				</div>
			) : (
				<article className={styles["explore-analysis-content"]}>
					{error && (
						<div className={styles["error-message"]}>
							<p>{error}</p>
						</div>
					)}

					<div className={styles["explore-analysis-results"]}>
						<div className={styles["explore-results-content"]}>
							<div className={styles["explore-results-content-inner"]}>
								{messages.length === 0 ? (
									<p className="grid place-items-center h-full">
										AIが探索後、探索結果がここに表示されます。
									</p>
								) : (
									<>
										<h3 className={styles["explore-results-title"]}>
											{isAnalyzing || status === "streaming"
												? "探索中..."
												: "~ 探索結果 ~"}
										</h3>
										<hr />
										{messages.map((message, _) => (
											<React.Fragment key={message.id || Math.random()}>
												{message.role === "assistant" && (
													<div className={styles["explore-response"]}>
														<div className={styles["explore-response-content"]}>
															{message.content
																.split("\n")
																.map((line: string, lineIndex: number) => (
																	<p
																		key={lineIndex}
																		className={styles["explore-response-text"]}
																	>
																		{line}
																	</p>
																))}
														</div>
													</div>
												)}
											</React.Fragment>
										))}
									</>
								)}
							</div>
						</div>
					</div>
				</article>
			)}
		</div>
	);
};

export default ExploreArticleAnalysis;
