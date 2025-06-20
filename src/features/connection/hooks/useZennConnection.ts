import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useHero } from "@/contexts/HeroContext";
import { UserInfo } from "../types";
import { cleanUsername, isValidZennUsernameFormat } from "../utils";
import { SUSPICIOUS_FIXED_COUNT } from "../constants";
import {
	checkZennUser,
	updateUserProfile as updateUserProfileApi,
	syncZennArticles as syncZennArticlesApi,
	updateArticleCount,
} from "../api";

interface UseZennConnectionProps {
	playClickSound: (callback?: () => void) => void;
	showSuccessMessage: (message: string) => void;
	setUserInfo: (userInfo: UserInfo | null) => void;
	setError: (error: string) => void;
}

export const useZennConnection = ({
	playClickSound,
	showSuccessMessage,
	setUserInfo,
	setError,
}: UseZennConnectionProps) => {
	const { user } = useUser();
	const { refetchHeroData } = useHero();
	const [loading, setLoading] = useState(false);

	const updateUserProfile = async (zennUsername: string): Promise<boolean> => {
		playClickSound();
		if (!zennUsername) {
			setError("ユーザー名を入力してください");
			return false;
		}

		const username = cleanUsername(zennUsername);

		if (!isValidZennUsernameFormat(username)) {
			setError(
				"ユーザー名が無効です。小文字英数字 (a-z, 0-9)、アンダースコア (_)、ハイフン (-) のみ使用できます。"
			);
			return false;
		}

		setLoading(true);

		try {
			// Zennアカウントが存在するか確認
			const checkData = await checkZennUser(username);

			if (!checkData.success) {
				setError(checkData.error || "ユーザー名の検証に失敗しました");
				setLoading(false);
				return false;
			}

			// APIが常に48件を返す問題に対応
			const randomUsername = `test_${Math.random()
				.toString(36)
				.substring(2, 10)}`;
			const testResponse = await fetch(`/api/zenn?username=${randomUsername}`);
			const testData = await testResponse.json();

			if (
				checkData.totalCount === SUSPICIOUS_FIXED_COUNT &&
				testData.success &&
				testData.totalCount === SUSPICIOUS_FIXED_COUNT
			) {
				setError("Zennとの連携に失敗しました。存在しないユーザー名です。");
				setLoading(false);
				return false;
			}

			// 記事数が0の場合のリトライ処理
			if (!checkData.articles || checkData.articles.length === 0) {
				setError("記事を確認中...（投稿直後の場合、少しお待ちください）");
				await new Promise((resolve) => setTimeout(resolve, 1000));

				const retryData = await checkZennUser(username);

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

				checkData.articles = retryData.articles;
				checkData.totalCount = retryData.totalCount;
				setError("");
			}

			// プロフィールを更新
			const data = await updateUserProfileApi(
				username,
				user?.firstName
					? `${user.firstName} ${user.lastName || ""}`.trim()
					: undefined,
				user?.imageUrl
			);

			if (data.success && data.user) {
				setUserInfo(data.user);

				// 追加で記事数を同期
				try {
					const syncData = await syncZennArticlesApi(username);

					if (syncData.success) {
						if (syncData.user) {
							setUserInfo(syncData.user);
						}

						const articleCount = syncData.totalCount || 0;
						const successMessage = `Zennのアカウント連携が完了しました。${articleCount}件の記事が見つかりました。`;
						showSuccessMessage(successMessage);

						// 記事数をデータベースに保存
						try {
							const updateData = await updateArticleCount(articleCount);
							if (updateData.success && updateData.user) {
								setUserInfo(updateData.user);
							}
						} catch (dbUpdateError) {
							console.error("記事数更新エラー:", dbUpdateError);
						}
					} else {
						const successMessage = `Zennのアカウント連携が完了しました。記事データは後ほど同期されます。`;
						showSuccessMessage(successMessage);
					}
				} catch (syncError) {
					const successMessage = `Zennのアカウント連携が完了しました。記事データは後ほど同期されます。`;
					showSuccessMessage(successMessage);
				}

				// HeroContextのデータを更新
				try {
					await refetchHeroData();
				} catch (heroError) {
					console.error("HeroContext更新エラー:", heroError);
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

	return {
		updateUserProfile,
		loading,
	};
};
