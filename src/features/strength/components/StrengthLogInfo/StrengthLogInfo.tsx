"use client";

import React, { useState, useEffect } from "react";
import styles from "./StrengthLogInfo.module.css";
import { fetchZennArticles } from "@/features/posts/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

// ローカルストレージのキー
const ADVENTURE_LOGS_KEY = "adventure_logs";

const StrengthLogInfo = () => {
	const [logs, setLogs] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	useEffect(() => {
		// コンポーネントマウント時に実行される
		const initializeLogs = async () => {
			try {
				// ★★★ router.refresh() を呼び出してデータ再検証を試みる ★★★
				router.refresh();

				// refreshが非同期のため、少し待機してからログ処理を開始
				// (確実に完了を待つ保証はない点に注意)
				await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5秒待機

				// 全記事分のログを生成
				await generateLogs();
			} catch (err) {
				console.error("ログの初期化エラー:", err);
				setError("ログデータの初期化中にエラーが発生しました。");
				setLoading(false);
			}
		};

		initializeLogs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 依存配列は空のまま（初回マウント時のみ実行）

	// Zenn記事からログを生成する関数
	const generateLogs = async () => {
		try {
			setLoading(true);

			// 連携済みユーザー情報を取得
			const userRes = await fetch("/api/user");
			const userData = await userRes.json();

			let username = null;

			if (!userData.success || !userData.user.zennUsername) {
				// ゲストユーザーまたは連携未設定の場合は@aoyamadevのデータを使用
				username = "aoyamadev";
			} else {
				username = userData.user.zennUsername;
			}
			// Zenn記事を取得
			const articles = await fetchZennArticles(username, {
				fetchAll: true,
			});

			if (articles.length === 0) {
				const defaultLogs = generateDefaultLogs();
				saveLogs(defaultLogs);
				setLogs(defaultLogs);
				return;
			}

			// 全記事をループしてログ配列を生成（最新順）
			const totalCount = articles.length;
			const newLogs = articles.map((article, index) => {
				const dateStr =
					article.publishedAt ??
					(typeof article.date === "string"
						? article.date
						: article.date?.toISOString());
				const date = dateStr ? new Date(dateStr) : new Date();
				const formattedDate = formatDate(date);
				const level = totalCount - index;
				return `${formattedDate} 経験値を1獲得！勇者は「Lv${level}」にあがった！`;
			});

			// 保存して状態にセット
			saveLogs(newLogs);
			setLogs(newLogs);
		} catch (err) {
			console.error("Zenn記事の取得エラー:", err);

			// エラー時はデフォルトログを表示
			const defaultLogs = generateDefaultLogs();
			saveLogs(defaultLogs);
			setLogs(defaultLogs);
		} finally {
			setLoading(false);
		}
	};

	// 日付をフォーマットする関数
	const formatDate = (date: Date): string => {
		return `${date.getFullYear()}/${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")} ${date
			.getHours()
			.toString()
			.padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
			.getSeconds()
			.toString()
			.padStart(2, "0")}`;
	};

	// デフォルトのログを生成
	const generateDefaultLogs = (): string[] => {
		return [
			"冒険ログはまだありません",
			"---",
		];
	};

	// ログを保存する関数
	const saveLogs = (logs: string[]) => {
		if (typeof window === "undefined") return;

		try {
			// 保存前に重複を取り除く
			const uniqueLogs = Array.from(new Set(logs));
			localStorage.setItem(ADVENTURE_LOGS_KEY, JSON.stringify(uniqueLogs));
		} catch (e) {
			console.error("ログの保存エラー:", e);
		}
	};

	if (error) {
		return (
			<div className={styles["strength-log-info"]}>
				<div className={styles["strength-log-info-content"]}>
					<div className={styles["strength-log-box"]}>
						<h2 className={styles["strength-log-title"]}>~ 冒険ログ ~</h2>
						<div className={styles["error-text"]}>{error}</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles["strength-log-info"]}>
			<div className={styles["strength-log-info-content"]}>
				<div className={styles["strength-log-box"]}>
					<h2 className={styles["strength-log-title"]}>~ 冒険ログ ~</h2>
					<div className={styles["strength-log-list-content"]}>
						<div className={styles["strength-log-list-box"]}>
							<ul className={styles["strength-log-list"]}>
								{loading ? (
									<li className={styles["strength-log-item"]}>
										<p className={styles["strength-log-loading-text"]}>
											読み込み中...
										</p>
									</li>
								) : (
									// 最大15件のログのみ表示
									logs.slice(0, 15).map((log, index) => (
										<li key={index} className={styles["strength-log-item"]}>
											<p className={styles["strength-log-text"]}>{log}</p>
										</li>
									))
								)}
							</ul>
						</div>
					</div>
					<div className={styles["strength-log-link-box"]}>
						<Link
							href="/logs"
							className={styles["strength-log-link"]}
							onClick={(e) => handleNavigation(e, "/logs")}
						>
							過去のログを全て確認する
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StrengthLogInfo;
