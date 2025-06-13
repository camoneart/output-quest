"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
	ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { fetchZennArticles } from "@/features/posts/services";
import { HeroData } from "@/types/hero.types";
import { strengthHeroData } from "@/features/strength/data/strengthHeroData";

// Contextの型定義
type HeroContextType = {
	heroData: HeroData;
	isLoading: boolean;
	error: string | null;
	refetchHeroData: () => Promise<void>;
};

// Contextの作成
const HeroContext = createContext<HeroContextType | undefined>(undefined);

// キャッシュキーとタイムスタンプを管理する型
type CacheEntry = {
	data: HeroData;
	timestamp: number;
	userId: string;
};

// キャッシュの有効期間（5分）
const CACHE_DURATION = 5 * 60 * 1000;

// メモリキャッシュ
const heroDataCache = new Map<string, CacheEntry>();

// Providerコンポーネント
export const HeroProvider = ({ children }: { children: ReactNode }) => {
	const { user, isLoaded } = useUser();
	const [heroData, setHeroData] = useState<HeroData>({
		...strengthHeroData,
		level: 1,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// AbortControllerのrefを管理
	const abortControllerRef = useRef<AbortController | null>(null);

	// 前回のユーザーIDを記録してユーザー変更を検知
	const prevUserIdRef = useRef<string | null>(null);

	// キャッシュからデータを取得する関数
	const getCachedHeroData = useCallback((userId: string): HeroData | null => {
		const cached = heroDataCache.get(userId);
		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			return cached.data;
		}
		// 期限切れのキャッシュを削除
		if (cached) {
			heroDataCache.delete(userId);
		}
		return null;
	}, []);

	// キャッシュにデータを保存する関数
	const setCachedHeroData = useCallback((userId: string, data: HeroData) => {
		heroDataCache.set(userId, {
			data,
			timestamp: Date.now(),
			userId,
		});
	}, []);

	// リトライロジックを最適化した記事データ取得関数
	const getZennArticlesCount = useCallback(
		async (retryCount = 0, signal?: AbortSignal) => {
			// ユーザー情報が読み込まれていない場合は待機
			if (!isLoaded) {
				setIsLoading(true);
				return;
			}

			// ユーザーがログインしていない場合はゲストユーザーとして開発者のデータを表示
			if (isLoaded && !user) {
				const guestUserId = "guest";
				const cachedData = getCachedHeroData(guestUserId);
				if (cachedData) {
					setHeroData(cachedData);
				setIsLoading(false);
					setError(null);
					return;
				}

				setIsLoading(true);
				setError(null);
				try {
					const guestUsername = "aoyamadev";
					const articles = await fetchZennArticles(guestUsername, {
						fetchAll: true,
					});
					const articlesCount = articles.length;
					const calculatedLevel = articlesCount;
					const newHeroData = {
						...strengthHeroData,
						level: calculatedLevel,
						currentExp: 40,
						nextLevelExp: 100,
						remainingArticles: 1,
					};
					setHeroData(newHeroData);
					setCachedHeroData(guestUserId, newHeroData);
				} catch (err) {
					if (signal?.aborted) {
						return;
					}
					setError("ゲストデータの取得に失敗しました");
					// エラー時は初期データを表示
					setHeroData({ ...strengthHeroData, level: 1 });
				} finally {
					setIsLoading(false);
				}
				return;
			}

			if (isLoaded && user) {
				// キャッシュをチェック
				const cachedData = getCachedHeroData(user.id);
				if (cachedData && retryCount === 0) {
					setHeroData(cachedData);
					setIsLoading(false);
					setError(null);
					return;
				}

				setIsLoading(true);
				setError(null);

				// 初回ユーザーの可能性が高い場合は、認証が安定するまで待機
				if (retryCount === 0) {
					// 認証が安定するまで短時間待機
					await new Promise((resolve) => setTimeout(resolve, 300)); // 2秒 → 300msに短縮

					// シグナルチェック
					if (signal?.aborted) {
						return;
					}
				}

				try {
					// より丁寧なfetch処理
					let userRes: Response;

					try {
						userRes = await fetch("/api/user", {
							cache: "no-store",
							headers: {
								"Cache-Control": "no-cache",
							},
							signal,
						});
					} catch {
						if (signal?.aborted) {
							return;
						}

						const defaultData = { ...strengthHeroData, level: 1 };
						setHeroData(defaultData);
						setCachedHeroData(user.id, defaultData);
						setIsLoading(false);
						setError(null);
						return;
					}

					// リクエストがキャンセルされた場合は処理を中断
					if (signal?.aborted) {
						return;
					}

					const userData = await userRes.json();

					if (userRes.ok && userData.success && userData.user.zennUsername) {
						const username = userData.user.zennUsername;
						const dbArticleCount = userData.user.zennArticleCount || 0;

						// データベースに記事数が保存されている場合は、それを優先して使用
						// ただし、Zenn APIによる最新データも取得して比較
						try {
						// Zenn APIを呼び出してユーザーデータを更新
						await fetch(`/api/zenn?username=${username}&updateUser=true`, {
							signal,
						});

						if (signal?.aborted) {
							return;
						}

							// データベースの記事数を信頼し、それをベースにレベル計算
							const calculatedLevel = Math.max(dbArticleCount, 1);
							const newHeroData = {
								...strengthHeroData,
								level: calculatedLevel,
								currentExp: 40,
								nextLevelExp: 100,
								remainingArticles: 1,
							};

							setHeroData(newHeroData);
							setCachedHeroData(user.id, newHeroData);
							setIsLoading(false);
							setError(null);
						} catch (zennError) {
							// Zenn API呼び出しに失敗した場合でも、データベースの値を使用
							const calculatedLevel = Math.max(dbArticleCount, 1);
						const newHeroData = {
							...strengthHeroData,
							level: calculatedLevel,
							currentExp: 40,
							nextLevelExp: 100,
							remainingArticles: 1,
						};

						setHeroData(newHeroData);
							setCachedHeroData(user.id, newHeroData);
						setIsLoading(false);
						setError(null);
						}
					} else if (
						userRes.ok &&
						userData.success &&
						(!userData.user.zennUsername || userData.isNewUser)
					) {
						// 既存ユーザー（Zenn未連携）または初回ユーザーの場合
						// フォールバックとしてaoyamadevのデータを使用
						try {
							const guestUsername = "aoyamadev";
							const articles = await fetchZennArticles(guestUsername, {
								fetchAll: true,
							});
							const articlesCount = articles.length;
							const calculatedLevel = articlesCount;
							const newHeroData = {
								...strengthHeroData,
								level: calculatedLevel,
								currentExp: 40,
								nextLevelExp: 100,
								remainingArticles: 1,
							};
							setHeroData(newHeroData);
							setCachedHeroData(user.id, newHeroData);
						} catch (guestErr) {
							if (signal?.aborted) {
								return;
							}
							// エラー時は初期データを表示
						const defaultData = { ...strengthHeroData, level: 1 };
						setHeroData(defaultData);
							setCachedHeroData(user.id, defaultData);
						}
						setIsLoading(false);
						setError(null);
					} else {
						// エラーの場合のリトライ
						if (retryCount < 1) {
							const timeoutId = setTimeout(() => {
								if (!signal?.aborted) {
									getZennArticlesCount(retryCount + 1, signal);
								}
							}, 1000);

							signal?.addEventListener("abort", () => {
								clearTimeout(timeoutId);
							});
						} else {
							const defaultData = { ...strengthHeroData, level: 1 };
							setHeroData(defaultData);
							setIsLoading(false);
							setError("データの取得に失敗しました");
						}
					}
				} catch (err) {
					if (signal?.aborted) {
						return;
					}

					const defaultData = { ...strengthHeroData, level: 1 };
					setHeroData(defaultData);
					setIsLoading(false);
					setError("ネットワークエラーが発生しました");
				}
			}
		},
		[isLoaded, user, getCachedHeroData, setCachedHeroData]
	);

	// 外部から呼び出し可能な再取得関数（キャッシュを無効化）
	const refetchHeroData = useCallback(async () => {
		const userId = user ? user.id : "guest";

			// キャッシュを削除
		heroDataCache.delete(userId);

			// 既存のリクエストをキャンセル
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// 新しいAbortControllerを作成
			abortControllerRef.current = new AbortController();
			await getZennArticlesCount(0, abortControllerRef.current.signal);
	}, [getZennArticlesCount, user]);

	// ユーザー変更またはマウント時の処理
	useEffect(() => {
		const currentUserId = user ? user.id : "guest";
		// ユーザーが変更された場合は既存のリクエストをキャンセル
		if (prevUserIdRef.current !== currentUserId) {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		}

		prevUserIdRef.current = currentUserId;

		// 新しいAbortControllerを作成
		abortControllerRef.current = new AbortController();
		getZennArticlesCount(0, abortControllerRef.current.signal);

		// クリーンアップ関数
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [getZennArticlesCount, user]);

	// メモ化されたコンテキスト値
	const contextValue = useMemo(
		() => ({
			heroData,
			isLoading,
			error,
			refetchHeroData,
		}),
		[heroData, isLoading, error, refetchHeroData]
	);

	return (
		<HeroContext.Provider value={contextValue}>{children}</HeroContext.Provider>
	);
};

// カスタムフック
export const useHero = () => {
	const context = useContext(HeroContext);
	if (context === undefined) {
		throw new Error("useHero must be used within a HeroProvider");
	}
	return context;
};
