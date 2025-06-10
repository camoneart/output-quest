"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "./ConnectionPageClient.module.css";
import * as Connection from "@/features/connection/components";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { useHero } from "@/contexts/HeroContext";
import {
	useSessionManagement,
	useMessageStorage,
} from "@/features/connection/hooks";
import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton/AuthButton";

// グローバル変数の型拡張
declare global {
	interface Window {
		__clerk_custom_signout_handler?: () => Promise<void>;
	}
}

// ユーザープロフィールの型定義
interface UserInfo {
	id: string;
	clerkId: string;
	displayName?: string;
	zennUsername?: string;
	profileImage?: string;
	zennArticleCount: number;
}

// ローカルストレージのキー
const SESSION_ID_KEY = "zenn_session_id";
const LOGOUT_FLAG_KEY = "zenn_logout_flag";

// ユーザープロフィールページ
export default function ConnectionPageClient() {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { refetchHeroData } = useHero();
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [zennUsername, setZennUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [releaseMessage, setReleaseMessage] = useState("");
	const [wasLoggedOut, setWasLoggedOut] = useState(false);
	const [isNewSession, setIsNewSession] = useState(false);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);

	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	// カスタムフックを使用
	useSessionManagement({
		user,
		isLoaded,
		setWasLoggedOut,
		setIsNewSession,
		setUserInfo,
		setZennUsername,
	});

	const { showSuccessMessage } = useMessageStorage({
		setSuccess,
		setReleaseMessage,
		setWasLoggedOut,
	});

	// 遅延付きページ遷移の処理
	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	// 最新のユーザー情報を取得する関数
	const fetchLatestUserInfo = useCallback(async () => {
		try {
			let response: Response;
			try {
				response = await fetch("/api/user");
			} catch (networkError) {
				console.error(
					"[ConnectionPageClient] fetchLatestUserInfo: Network error during fetch /api/user:",
					networkError
				);
				setUserInfo(null);
				setZennUsername("");
				return;
			}

			const data = await response.json();

			// APIが正常に応答した場合の処理
			if (response.ok && data.success) {
				if (data.isNewUser) {
					setUserInfo(null);
					setZennUsername("");
					return;
				}

				// 既存ユーザーの場合
				setUserInfo(data.user);
				setZennUsername(data.user.zennUsername || "");
			} else if (response.status === 401) {
				console.warn(
					"[ConnectionPageClient] fetchLatestUserInfo: Auth error (401). Setting to initial state."
				);
				setUserInfo(null);
				setZennUsername("");
				return;
			} else {
				console.warn(
					`[ConnectionPageClient] fetchLatestUserInfo: API call failed or data.success is false. Status: ${response.status}, data:`,
					JSON.stringify(data, null, 2)
				);
				// エラーの場合でも、UIが不安定になるのを避けるため、状態を初期化しないでおくか、検討が必要。
				// 今回は一旦そのまま（エラー前の状態を維持）
				return;
			}
		} catch (err) {
			// ネットワークエラーなどの場合のみログ出力
			if (err instanceof Error && err.name !== "AbortError") {
				console.error(
					"[ConnectionPageClient] fetchLatestUserInfo: Generic error caught:",
					err
				);
			}
		} finally {
			// このfinallyブロックは残し、中のconsole.logのみ削除
		}
	}, [setUserInfo, setZennUsername]);

	// Zenn連携をリセットする共通関数
	const resetZennConnection = useCallback(async () => {
		try {
			// 入力欄をクリア
			setZennUsername("");

			// 連携解除専用APIを呼び出し
			const resetResponse = await fetch("/api/user/reset-connection", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ clerkId: user?.id }),
			});

			await resetResponse.json();

			// 通常の連携解除処理も実行
			const userResponse = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					zennUsername: "",
					displayName: user?.firstName
						? `${user.firstName} ${user.lastName || ""}`.trim()
						: undefined,
					profileImage: user?.imageUrl,
					forceReset: true, // 強制リセットフラグ
				}),
			});

			await userResponse.json();

			// 状態を直接更新
			setUserInfo(null);
			setZennUsername("");
			setError("");
			setSuccess("");

			// フラグをリセット
			setWasLoggedOut(false);
			setIsNewSession(false);
		} catch (err) {
			console.error("連携リセットエラー:", err);

			// エラーが発生した場合でも状態をリセット
			setUserInfo(null);
			setZennUsername("");
			setWasLoggedOut(false);
			setIsNewSession(false);
		}
	}, [user]);

	// ユーザー情報を取得
	useEffect(() => {
		const fetchUserInfo = async () => {
			// Clerkの初期化が完了していない場合は何もしない
			if (!isLoaded) {
				return;
			}

			// 初期化フラグをオフにして、実際の処理を開始
			setIsInitializing(false);

			// ユーザーがログインしていない場合、状態をリセット
			if (!user) {
				setUserInfo(null);
				setZennUsername("");
				setIsZennInfoLoaded(true);
				return;
			}

			// ユーザーがログイン済みで、まだZenn情報がロードされていない場合のみ処理
			if (!isZennInfoLoaded) {
				console.log("[ConnectionPageClient] Zenn情報ロード開始");
				setIsZennInfoLoaded(false);

				try {
					const wasLoggedOutFlag = wasLoggedOut;
					const isNewSessionFlag = isNewSession;

					if (wasLoggedOutFlag || isNewSessionFlag) {
						await resetZennConnection();
					} else {
						await fetchLatestUserInfo();
					}
				} catch (err) {
					console.error("ユーザープロフィール取得エラー:", err);
				} finally {
					// ロード完了を通知してUIをアンブロック
					setIsZennInfoLoaded(true);
				}
			}
		};

		fetchUserInfo();
	}, [
		isLoaded,
		user?.id, // user.id のみに依存してuserオブジェクト全体の変更による再実行を防ぐ
		// wasLoggedOut, isNewSession は削除して不要な再実行を防ぐ
	]);

	// ログアウト/新セッション時の特別処理
	useEffect(() => {
		if (isLoaded && user && (wasLoggedOut || isNewSession)) {
			console.log("[ConnectionPageClient] ログアウト/新セッション処理");
			setIsZennInfoLoaded(false);
			resetZennConnection().finally(() => {
				setIsZennInfoLoaded(true);
			});
		}
	}, [wasLoggedOut, isNewSession, isLoaded, user?.id, resetZennConnection]);

	// ユーザープロフィールを更新
	const updateUserProfile = async (): Promise<boolean> => {
		playClickSound();
		if (!zennUsername) {
			setError("ユーザー名を入力してください");
			return false;
		}

		// @を取り除く
		const cleanUsername = zennUsername.replace(/^@/, "");

		// ユーザー名の形式をチェック
		if (!isValidZennUsernameFormat(cleanUsername)) {
			setError(
				"ユーザー名が無効です。小文字英数字 (a-z, 0-9)、アンダースコア (_)、ハイフン (-) のみ使用できます。"
			);
			return false;
		}

		// ロード開始時にreleaseMessageをクリア
		setLoading(true);
		setError("");
		setSuccess("");
		setReleaseMessage("");

		try {
			// まずZennアカウントが存在するか確認
			const checkResponse = await fetch(`/api/zenn?username=${cleanUsername}`);
			const checkData = await checkResponse.json();

			if (!checkData.success) {
				setError(checkData.error || "ユーザー名の検証に失敗しました");
				setLoading(false);
				return false;
			}

			// APIが常に48件を返す問題に対応するための事前チェック
			const randomUsername = `test_${Math.random()
				.toString(36)
				.substring(2, 10)}`;
			const testResponse = await fetch(`/api/zenn?username=${randomUsername}`);
			const testData = await testResponse.json();
			const suspiciousFixedCount = 48;
			if (
				checkData.totalCount === suspiciousFixedCount &&
				testData.success &&
				testData.totalCount === suspiciousFixedCount
			) {
				setError("Zennとの連携に失敗しました。存在しないユーザー名です。");
				setLoading(false);
				return false;
			}

			// 記事数が0または記事が見つからない場合はユーザーが存在しないと判断
			if (!checkData.articles || checkData.articles.length === 0) {
				setError(
					"このユーザー名のアカウントは記事を投稿していないため連携できません"
				);
				setLoading(false);
				return false;
			}

			const response = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					zennUsername: cleanUsername,
					displayName: user?.firstName
						? `${user.firstName} ${user.lastName || ""}`.trim()
						: undefined,
					profileImage: user?.imageUrl,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setUserInfo(data.user);

				// 追加で記事数を同期してuserInfoを最新に更新
				try {
					console.log(`[updateUserProfile] Zenn API同期開始: ${cleanUsername}`);
					const syncResponse = await fetch(
						`/api/zenn?username=${cleanUsername}&updateUser=true`
					);

					if (!syncResponse.ok) {
						console.error(
							`[updateUserProfile] Zenn API HTTP エラー: ${syncResponse.status}`
						);
						throw new Error(`HTTP ${syncResponse.status}`);
					}

					const syncData = await syncResponse.json();
					console.log(`[updateUserProfile] Zenn API レスポンス:`, syncData);

					if (syncData.success) {
						if (syncData.user) {
							setUserInfo(syncData.user);
							console.log(
								`[updateUserProfile] ユーザー情報更新成功:`,
								syncData.user
							);
						}

						// 成功メッセージに記事数を含める
						const articleCount = syncData.totalCount || 0;
						const successMessage = `Zennのアカウント連携が完了しました。${articleCount}件の記事が見つかりました。`;
						showSuccessMessage(successMessage);
						console.log(
							`[updateUserProfile] 連携成功: ${articleCount}件の記事`
						);

						// 記事数をデータベースにも保存（重要：ページリロード時の一貫性のため）
						try {
							console.log(
								`[updateUserProfile] 記事数をデータベースに保存: ${articleCount}件`
							);
							const updateResponse = await fetch("/api/user", {
								method: "PUT",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									articleCount: articleCount,
								}),
							});

							if (updateResponse.ok) {
								const updateData = await updateResponse.json();
								if (updateData.success && updateData.user) {
									setUserInfo(updateData.user);
									console.log(
										`[updateUserProfile] データベース記事数更新成功:`,
										updateData.user
									);
								}
							} else {
								console.warn(
									`[updateUserProfile] データベース記事数更新失敗: HTTP ${updateResponse.status}`
								);
							}
						} catch (dbUpdateError) {
							console.error(
								"[updateUserProfile] データベース記事数更新エラー:",
								dbUpdateError
							);
							// データベース更新エラーは警告程度に留める（連携自体は成功）
						}
					} else {
						console.warn(
							`[updateUserProfile] Zenn API success=false:`,
							syncData
						);
						// レスポンスでsuccess=falseでも、エラーメッセージがない場合は連携成功とする
						const successMessage = `Zennのアカウント連携が完了しました。記事データは後ほど同期されます。`;
						showSuccessMessage(successMessage);
					}
				} catch (syncError) {
					console.error("updateUserProfile: 記事同期エラー:", syncError);
					// ネットワークエラーや一時的な問題の場合は連携成功として扱う
					const successMessage = `Zennのアカウント連携が完了しました。記事データは後ほど同期されます。`;
					showSuccessMessage(successMessage);
				}

				setReleaseMessage("");

				// HeroContextのデータを更新
				try {
					await refetchHeroData();
				} catch (heroError) {
					console.warn(
						"updateUserProfile: HeroContextデータ更新エラー:",
						heroError
					);
				}

				return true;
			} else {
				setError(data.error || "プロフィールの更新に失敗しました");
				return false;
			}
		} catch (err) {
			console.error("プロフィール更新エラー:", err);
			setError("エラーが発生しました");
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Zenn記事データを同期
	const syncZennArticles = async (shouldRedirect = false) => {
		if (!zennUsername) {
			setError("ユーザー名を入力してください");
			return;
		}

		// @を取り除く
		const cleanUsername = zennUsername.replace(/^@/, "");

		// ユーザー名の形式をチェック
		if (!isValidZennUsernameFormat(cleanUsername)) {
			setError(
				"ユーザー名が無効です。小文字英数字 (a-z, 0-9)、アンダースコア (_)、ハイフン (-) のみ使用できます。"
			);
			return;
		}

		setLoading(true);
		setError("");
		setSuccess("");

		try {
			// APIが常に48件を返す問題に対応するための事前チェック
			// 明らかに存在しないランダムなユーザー名でテスト
			const randomUsername = `test_${Math.random()
				.toString(36)
				.substring(2, 10)}`;
			const testResponse = await fetch(`/api/zenn?username=${randomUsername}`);
			const testData = await testResponse.json();

			// テスト用の明らかに無効なユーザー名でも成功レスポンスを返す場合
			if (testData.success && testData.totalCount > 0) {
				console.warn(
					"APIが無効なユーザー名でも成功レスポンスを返しています",
					testData
				);
			}

			// Zenn APIを呼び出し、記事データを取得
			const response = await fetch(
				`/api/zenn?username=${cleanUsername}&updateUser=true`
			);
			const data = await response.json();

			// 存在しないユーザーの場合、バックエンドAPIが常に48件を返す問題の一時的な対策
			const suspiciousFixedCount = 48;
			if (data.success && data.totalCount === suspiciousFixedCount) {
				// ランダムなユーザー名のテスト結果と比較
				if (testData.success && testData.totalCount === suspiciousFixedCount) {
					setError("Zennとの連携に失敗しました。存在しないユーザー名です。");
					setLoading(false);
					return;
				}
			}

			if (data.success) {
				// 記事数が0件でも成功として処理
				const articleCount = data.totalCount || 0;

				if (data.user) {
					setUserInfo(data.user);
				}

				// 表示メッセージを連携 or 同期に応じて切り替え
				const successMessage = shouldRedirect
					? `Zennのアカウント連携が完了しました。${articleCount}件の記事が見つかりました。`
					: `同期が完了しました。${articleCount}件の記事が見つかりました。`;
				showSuccessMessage(successMessage);
				setReleaseMessage("");

				// 記事数をデータベースにも保存（重要：ページリロード時の一貫性のため）
				try {
					console.log(
						`[syncZennArticles] 記事数をデータベースに保存: ${articleCount}件`
					);
					const updateResponse = await fetch("/api/user", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							articleCount: articleCount,
						}),
					});

					if (updateResponse.ok) {
						const updateData = await updateResponse.json();
						if (updateData.success && updateData.user) {
							setUserInfo(updateData.user);
							console.log(
								`[syncZennArticles] データベース記事数更新成功:`,
								updateData.user
							);
						}
					} else {
						console.warn(
							`[syncZennArticles] データベース記事数更新失敗: HTTP ${updateResponse.status}`
						);
					}
				} catch (dbUpdateError) {
					console.error(
						"[syncZennArticles] データベース記事数更新エラー:",
						dbUpdateError
					);
					// データベース更新エラーは警告程度に留める（同期自体は成功）
				}

				// HeroContextのデータを更新（Zenn連携後にレベル情報を最新にする）
				try {
					await refetchHeroData();
				} catch (heroError) {
					console.warn("HeroContextデータ更新エラー:", heroError);
				}
			} else {
				console.warn("[syncZennArticles] API success=false:", data);
				setError(
					data.error || "ユーザーが存在しないか、記事を取得できませんでした。"
				);
			}
		} catch (err) {
			console.error("Zenn同期エラー:", err);
			setError("エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	// Zennアカウント連携を解除する関数を定義
	const handleReleaseConnection = async () => {
		try {
			const response = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					zennUsername: "",
					displayName: userInfo?.displayName,
					profileImage: userInfo?.profileImage,
				}),
			});
			const data = await response.json();
			if (data.success) {
				setUserInfo({
					...userInfo!,
					zennUsername: "",
					zennArticleCount: 0,
				});
				setZennUsername("");
				setSuccess("");
				setReleaseMessage("Zennのアカウント連携を解除しました");
			} else {
				console.error("連携解除エラー:", data.error);
				setError(data.error || "連携解除に失敗しました");
			}
		} catch (err) {
			console.error("連携解除エラー:", err);
			setError("Zennアカウントの連携解除中にエラーが発生しました");
		}
	};

	// ログアウト時のイベントハンドラー
	useEffect(() => {
		const handleBeforeUnload = () => {
			// ユーザーがブラウザを閉じたり更新したりする際に、セッション情報を保持
			if (user) {
				localStorage.setItem(SESSION_ID_KEY, user.id);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [user]);

	// UserButtonコンポーネントにサインアウトハンドラを設定
	useEffect(() => {
		if (typeof window !== "undefined") {
			// 同期的な連携解除実行関数（async/awaitを使わず即時実行）
			const syncResetZennConnection = () => {
				// 確実にフラグを設定
				localStorage.setItem(LOGOUT_FLAG_KEY, "true");

				// 現在のユーザーIDを保存
				if (user?.id) {
					localStorage.setItem("zenn_previous_user", user.id);
				}

				// 画面上の状態をクリア
				setZennUsername("");
				setUserInfo(null);

				return true;
			};

			// Clerkのサインアウトイベントをカスタマイズ
			const handleClerkSignOut = async () => {
				try {
					// 最初に同期的な処理を実行
					syncResetZennConnection();

					// 次にセッション関連の状態をクリア
					localStorage.setItem(LOGOUT_FLAG_KEY, "true");
					localStorage.removeItem(SESSION_ID_KEY);

					// ユーザー情報があれば連携解除を実行（確実に実行が完了するように変更）
					if (user) {
						try {
							// 連携解除APIを呼び出し - 結果を待機する
							const resetResponse = await fetch("/api/user/reset-connection", {
								method: "DELETE",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({ clerkId: user?.id }),
								// キャッシュを無効化
								cache: "no-store",
							});

							await resetResponse.json();

							// 通常の連携解除処理も実行
							const userResponse = await fetch("/api/user", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									zennUsername: "",
									displayName: user?.firstName
										? `${user.firstName} ${user.lastName || ""}`.trim()
										: undefined,
									profileImage: user?.imageUrl,
									forceReset: true,
								}),
								// キャッシュを無効化
								cache: "no-store",
							});

							await userResponse.json();
						} catch (err) {
							console.error("Zenn連携解除中にエラー:", err);
						}
					}

					// 最後の保険として、再度ログアウトフラグを設定
					localStorage.setItem(LOGOUT_FLAG_KEY, "true");
					localStorage.removeItem(SESSION_ID_KEY);
				} catch (err) {
					console.error("サインアウトハンドラーエラー:", err);
					// エラーが発生しても必ずログアウトフラグは維持する
					localStorage.setItem(LOGOUT_FLAG_KEY, "true");
					localStorage.removeItem(SESSION_ID_KEY);
				}
			};

			// クリークのサインアウト前処理をグローバル変数に登録
			window.__clerk_custom_signout_handler = handleClerkSignOut;
		}

		return () => {
			if (typeof window !== "undefined") {
				window.__clerk_custom_signout_handler = undefined;
			}
		};
	}, [user, userInfo]);

	// ユーザー名が有効な形式かチェックする関数
	const isValidZennUsernameFormat = (username: string): boolean => {
		// Zennのユーザー名に使える文字は英数字、アンダースコア、ハイフンのみ
		return /^[a-zA-Z0-9_-]+$/.test(username);
	};

	return (
		<>
			<h1 className={`${styles["profile-title"]}`}>連携</h1>
			<div className={`${styles["profile-container"]}`}>
				{!isLoaded || isInitializing ? (
					<div className="p-4 text-center">読み込み中...</div>
				) : !user ? (
					<div
						className={`px-4 pt-3 pb-6 grid gap-8 ${styles["connection-container"]}`}
					>
						<div className={`${styles["auth-content"]}`}>
							<AuthButton />
							<div className="grid grid-cols-1 gap-[32px]">
								<p className="text-center text-base">
									Zennとの連携には「ログイン」または「新規登録」が必要です。
								</p>
								<div className="grid grid-cols-1 gap-2 place-items-center">
									<em className="text-center text-sm not-italic">
										※「ログイン」「新規登録」無しでも、ご利用いただけます。
									</em>
									<Link
										href="/connection-detail"
										className={styles["connection-detail-link"]}
									>
										詳細はこちら
									</Link>
								</div>
							</div>
						</div>
						<hr className={styles["center-line"]} />
						<Connection.ConnectionZennForm
							zennUsername={zennUsername}
							loading={loading}
							error={error}
							onUsernameChange={setZennUsername}
							onSubmit={updateUserProfile}
							isZennInfoLoaded={isZennInfoLoaded}
							isAuthenticated={false}
						/>
					</div>
				) : (
					<div className={styles["profile-info-container"]}>
						<div className={styles["profile-info-header"]}>
							<Connection.ConnectionUserProfileHeader user={user} />

							<hr className={styles["center-line"]} />
						</div>

						<div className={styles["connection-info-container"]}>
							{!isZennInfoLoaded ? (
								<div className="p-4 text-center">読み込み中...</div>
							) : userInfo ? (
								userInfo.zennUsername ? (
									<>
										<div className={styles["connection-info-zenn"]}>
											<Connection.ConnectionZennInfoDisplay
												userInfo={userInfo}
												loading={loading}
											/>
										</div>
										<div className={styles["connection-info-button-container"]}>
											<Connection.ConnectionNavigationToAdventure
												onNavigate={handleNavigation}
											/>
											<Connection.ConnectionButtonGroup
												loading={loading}
												userInfo={userInfo}
												onSync={() => syncZennArticles(false)}
												onRelease={handleReleaseConnection}
											/>
										</div>
									</>
								) : (
									<Connection.ConnectionZennForm
										zennUsername={zennUsername}
										loading={loading}
										error={error}
										onUsernameChange={setZennUsername}
										onSubmit={updateUserProfile}
										isZennInfoLoaded={isZennInfoLoaded}
										isAuthenticated={true}
									/>
								)
							) : (
								<Connection.ConnectionZennForm
									zennUsername={zennUsername}
									loading={loading}
									error={error}
									onUsernameChange={setZennUsername}
									onSubmit={updateUserProfile}
									isZennInfoLoaded={isZennInfoLoaded}
									isAuthenticated={true}
								/>
							)}
							<div className={styles["connection-info-message-container"]}>
								<Connection.ConnectionMessageDisplay
									error={error}
									success={success}
									releaseMessage={releaseMessage}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
