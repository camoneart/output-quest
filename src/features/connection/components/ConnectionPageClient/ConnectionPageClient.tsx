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

	// ユーザー情報を取得
	useEffect(() => {
		const fetchUserInfo = async () => {
			if (!isLoaded) return;

			// ユーザーがログインしていない場合、状態をリセット
			if (!user) {
				setUserInfo(null);
				setZennUsername("");
				setIsZennInfoLoaded(true); // 非ログイン時はロード完了
				return;
			}

			// ユーザーがログイン済みの場合、Zenn情報ロード開始
			setIsZennInfoLoaded(false);

			try {
				// ログアウト/新セッションフラグをチェック（一度だけ読み取り）
				if (wasLoggedOut || isNewSession) {
					// フラグをすぐにリセットして再実行を防ぐ
					setWasLoggedOut(false);
					setIsNewSession(false);

					// リセット処理を実行
					try {
			setZennUsername("");

			const resetResponse = await fetch("/api/user/reset-connection", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ clerkId: user?.id }),
			});

			await resetResponse.json();

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
			});

			await userResponse.json();

			setUserInfo(null);
			setZennUsername("");
			setError("");
			setSuccess("");
		} catch (err) {
			console.error("連携リセットエラー:", err);
			setUserInfo(null);
			setZennUsername("");
		}
				} else {
					// 通常のユーザー情報取得
					try {
						const response = await fetch("/api/user");
						const data = await response.json();

						if (response.ok && data.success) {
							if (data.isNewUser) {
				setUserInfo(null);
				setZennUsername("");
				return;
			}

							setUserInfo(data.user);
							setZennUsername(data.user.zennUsername || "");
						} else if (response.status === 401) {
							setUserInfo(null);
							setZennUsername("");
							return;
				} else {
							return;
						}
					} catch (err) {
						if (err instanceof Error && err.name !== "AbortError") {
							// ネットワークエラーは記録のみ
						}
					}
				}
			} catch (err) {
				console.error("ユーザープロフィール取得エラー:", err);
			} finally {
				setIsZennInfoLoaded(true);
			}
		};

		fetchUserInfo();
	}, [
		isLoaded,
		user?.id, // userオブジェクト全体ではなくuser.idのみ
	]);

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
			// まずZennアカウントが存在するか確認（完全キャッシュ無効化）
			const checkTimestamp = Date.now();
			const checkResponse = await fetch(
				`/api/zenn?username=${cleanUsername}&bustCache=true&_t=${checkTimestamp}`,
				{
					method: "GET",
					cache: "no-store",
					headers: {
						"Cache-Control": "no-cache, no-store, must-revalidate",
						Pragma: "no-cache",
						Expires: "0",
					},
				}
			);
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

			// 記事数が0または記事が見つからない場合、リトライ機構を追加
			if (!checkData.articles || checkData.articles.length === 0) {
				// 投稿直後の可能性があるため、少し待ってからリトライ
				setError("記事を確認中...（投稿直後の場合、少しお待ちください）");
				await new Promise((resolve) => setTimeout(resolve, 3000));

				// リトライ（より強力なキャッシュバスティング）
				const retryTimestamp = Date.now();
				const retryResponse = await fetch(
					`/api/zenn?username=${cleanUsername}&bustCache=true&_t=${retryTimestamp}`,
					{
						method: "GET",
						cache: "no-store",
						headers: {
							"Cache-Control": "no-cache, no-store, must-revalidate",
							Pragma: "no-cache",
							Expires: "0",
						},
					}
				);
				const retryData = await retryResponse.json();

				if (
					!retryData.success ||
					!retryData.articles ||
					retryData.articles.length === 0
				) {
				setError(
					"このユーザー名のアカウントは記事を投稿していないため連携できません"
				);
				setLoading(false);
				return false;
				}

				// リトライで記事が見つかった場合は、checkDataを更新
				checkData.articles = retryData.articles;
				checkData.totalCount = retryData.totalCount;
				setError(""); // エラーメッセージをクリア
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
					const syncTimestamp = Date.now();
					const syncResponse = await fetch(
						`/api/zenn?username=${cleanUsername}&updateUser=true&bustCache=true&_t=${syncTimestamp}`,
						{
							method: "GET",
							cache: "no-store",
							headers: {
								"Cache-Control": "no-cache, no-store, must-revalidate",
								Pragma: "no-cache",
								Expires: "0",
							},
						}
					);

					if (!syncResponse.ok) {
						throw new Error(`HTTP ${syncResponse.status}`);
					}

					const syncData = await syncResponse.json();

					if (syncData.success) {
						if (syncData.user) {
						setUserInfo(syncData.user);
						}

						// 成功メッセージに記事数を含める
						const articleCount = syncData.totalCount || 0;
						const successMessage = `Zennのアカウント連携が完了しました。${articleCount}件の記事が見つかりました。`;
						showSuccessMessage(successMessage);

						// 記事数をデータベースにも保存（重要：ページリロード時の一貫性のため）
						try {
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
								}
							}
						} catch (dbUpdateError) {
							// データベース更新エラーは警告程度に留める（連携自体は成功）
						}
					} else {
						// レスポンスでsuccess=falseでも、エラーメッセージがない場合は連携成功とする
						const successMessage = `Zennのアカウント連携が完了しました。記事データは後ほど同期されます。`;
						showSuccessMessage(successMessage);
					}
				} catch (syncError) {
					// ネットワークエラーや一時的な問題の場合は連携成功として扱う
					const successMessage = `Zennのアカウント連携が完了しました。記事データは後ほど同期されます。`;
					showSuccessMessage(successMessage);
				}

				setReleaseMessage("");

				// HeroContextのデータを更新
				try {
					await refetchHeroData();
				} catch (heroError) {
					// HeroContextデータ更新エラーは記録のみ
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
				// APIが無効なユーザー名でも成功レスポンスを返している場合の警告
			}

			// Zenn APIを呼び出し、記事データを取得（完全キャッシュ無効化）
			const timestamp = Date.now();
			const response = await fetch(
				`/api/zenn?username=${cleanUsername}&updateUser=true&bustCache=true&_t=${timestamp}`,
				{
					method: "GET",
					cache: "no-store", // Next.js fetchキャッシュを無効化
					headers: {
						"Cache-Control": "no-cache, no-store, must-revalidate",
						Pragma: "no-cache",
						Expires: "0",
					},
				}
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

				// 記事数が0件の場合は連携を自動解除
				if (articleCount === 0) {
					try {
						// 連携解除処理を実行
						const releaseResponse = await fetch("/api/user", {
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
						const releaseData = await releaseResponse.json();

						if (releaseData.success) {
							setUserInfo({
								...userInfo!,
								zennUsername: "",
								zennArticleCount: 0,
							});
							setZennUsername("");
							setSuccess("");
					setReleaseMessage("");
							setError(
								"連携中のアカウントの記事数が0件になったため連携を解除しました"
							);
				} else {
							console.error("自動連携解除エラー:", releaseData.error);
							setError(
								"記事数が0件のため連携解除を試みましたが、処理に失敗しました"
							);
						}
					} catch (err) {
						console.error("自動連携解除エラー:", err);
						setError(
							"記事数が0件のため連携解除を試みましたが、処理に失敗しました"
						);
					}
					setLoading(false);
					return;
				}

				// 記事数が1件以上の場合は通常の同期成功メッセージ
				const successMessage = shouldRedirect
					? `Zennのアカウント連携が完了しました。${articleCount}件の記事が見つかりました。`
					: `同期が完了しました。${articleCount}件の記事が見つかりました。`;
				showSuccessMessage(successMessage);
				setReleaseMessage("");

				// 記事数をデータベースにも保存（重要：ページリロード時の一貫性のため）
				try {
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
						}
					}
				} catch (dbUpdateError) {
					// データベース更新エラーは警告程度に留める（同期自体は成功）
				}

				// HeroContextのデータを更新（Zenn連携後にレベル情報を最新にする）
				try {
					await refetchHeroData();
				} catch (heroError) {
					// HeroContextデータ更新エラーは記録のみ
				}
			} else {
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
				{!isLoaded ? (
					<div className="p-4 text-center">読み込み中...</div>
				) : !user ? (
					<Connection.ConnectionAuthSection
						loading={loading}
						zennUsername={zennUsername}
						updateUserProfile={updateUserProfile}
					/>
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
