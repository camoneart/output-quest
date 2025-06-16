"use client";

import React, { Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import styles from "./ExploreArticleAnalysis.module.css";
import Link from "next/link";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

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

	const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

	// ローディング状態の表示
	if (!isLoaded || !isZennInfoLoaded) {
		return <p className={styles["loading-indicator"]}>読み込み中...</p>;
	}

	return (
		<div className={styles["explore-article-analysis-container"]}>
			{isGuestUser ? (
				<div className="grid place-items-center items-start grid-rows-[auto_1fr] gap-5">
					<p>この機能を利用するには、Zennアカウントとの連携が必要です。</p>
					<div className="grid place-items-center gap-6">
						<p>連携ページでログインを行ってください。</p>
						<Link
							href="/connection"
							className={styles["to-the-link-page-button"]}
							onClick={() => playClickSound()}
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
									<div className="h-full grid place-content-center place-items-center">
										<p>探索結果はここに表示されます。</p>
									</div>
								) : (
									<>
										<h2 className={styles["explore-results-title"]}>
											{isAnalyzing || status === "streaming"
												? "探索中..."
												: "~ 探索結果 ~"}
										</h2>

										<hr className={styles["explore-results-line"]} />

										{messages.map((message, _) => (
											<Fragment key={message.id || Math.random()}>
												{message.role === "assistant" && (
													<div className={styles["explore-response"]}>
														<div className={styles["explore-response-content"]}>
															<div
																className={styles["explore-response-markdown"]}
															>
																<ReactMarkdown
																	components={{
																		h3: ({ children }) => (
																			<h3 className={styles["markdown-h3"]}>
																				{children}
																			</h3>
																		),
																		h4: ({ children }) => (
																			<h4 className={styles["markdown-h4"]}>
																				{children}
																			</h4>
																		),
																		p: ({ children }) => (
																			<p className={styles["markdown-p"]}>
																				{children}
																			</p>
																		),
																		strong: ({ children }) => (
																			<strong
																				className={styles["markdown-strong"]}
																			>
																				{children}
																			</strong>
																		),
																		em: ({ children }) => (
																			<em className={styles["markdown-em"]}>
																				{children}
																			</em>
																		),
																		ul: ({ children }) => (
																			<ul className={styles["markdown-ul"]}>
																				{children}
																			</ul>
																		),
																		ol: ({ children }) => (
																			<ol className={styles["markdown-ol"]}>
																				{children}
																			</ol>
																		),
																		li: ({ children }) => (
																			<li className={styles["markdown-li"]}>
																				{children}
																			</li>
																		),
																		// hr: () => (
																		// 	<hr className={styles["markdown-hr"]} />
																		// ),
																	}}
																>
																	{message.content}
																</ReactMarkdown>
															</div>
														</div>
													</div>
												)}
											</Fragment>
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
