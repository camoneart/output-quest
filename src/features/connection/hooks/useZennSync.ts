import { useState } from "react";
import { useHero } from "@/contexts/HeroContext";
import { useEquipment } from "@/features/equipment/contexts/EquipmentContext";
import { UserInfo } from "../types";
import { cleanUsername, isValidZennUsernameFormat } from "../utils";
import { SUSPICIOUS_FIXED_COUNT } from "../constants";
import {
	syncZennArticles as syncZennArticlesApi,
	updateUserProfile as updateUserProfileApi,
	updateArticleCount,
} from "../api";

interface UseZennSyncProps {
	userInfo: UserInfo | null;
	showSuccessMessage: (message: string) => void;
	setUserInfo: (userInfo: UserInfo | null) => void;
	setZennUsername: (username: string) => void;
	setError: (error: string) => void;
}

export const useZennSync = ({
	userInfo,
	showSuccessMessage,
	setUserInfo,
	setZennUsername,
	setError,
}: UseZennSyncProps) => {
	const { refetchHeroData } = useHero();
	const { resetEquipment } = useEquipment();
	const [loading, setLoading] = useState(false);

	const syncZennArticles = async (
		zennUsername: string,
		shouldRedirect = false
	) => {
		if (!zennUsername) {
			setError("ユーザー名を入力してください");
			return;
		}

		const username = cleanUsername(zennUsername);

		if (!isValidZennUsernameFormat(username)) {
			setError(
				"ユーザー名が無効です。小文字英数字 (a-z, 0-9)、アンダースコア (_)、ハイフン (-) のみ使用できます。"
			);
			return;
		}

		setLoading(true);

		try {
			// APIが常に48件を返す問題に対応
			const randomUsername = `test_${Math.random()
				.toString(36)
				.substring(2, 10)}`;
			const testResponse = await fetch(`/api/zenn?username=${randomUsername}`);
			const testData = await testResponse.json();

			// Zenn APIを呼び出し、記事データを取得
			const data = await syncZennArticlesApi(username);

			// 存在しないユーザーの場合の対策
			if (data.success && data.totalCount === SUSPICIOUS_FIXED_COUNT) {
				if (
					testData.success &&
					testData.totalCount === SUSPICIOUS_FIXED_COUNT
				) {
					setError("Zennとの連携に失敗しました。存在しないユーザー名です。");
					setLoading(false);
					return;
				}
			}

			if (data.success) {
				const articleCount = data.totalCount || 0;

				if (data.user) {
					setUserInfo(data.user);
				}

				// 記事数が0件の場合は連携を自動解除
				if (articleCount === 0) {
					try {
						const releaseData = await updateUserProfileApi(
							"",
							userInfo?.displayName,
							userInfo?.profileImage
						);

						if (releaseData.success) {
							setUserInfo({
								...userInfo!,
								zennUsername: "",
								zennArticleCount: 0,
								level: 1, // 連携解除時にlevelもリセット
							});
							setZennUsername("");
							setError(
								"連携中のアカウントの記事数が0件になったため連携を解除しました"
							);

							// 自動連携解除時に装備をリセット
							resetEquipment();
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

				// 記事数が1件以上の場合
				const successMessage = shouldRedirect
					? `Zennのアカウント連携が完了しました。${articleCount}件の記事が見つかりました。`
					: `同期が完了しました。${articleCount}件の記事が見つかりました。`;
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

				// HeroContextのデータを更新
				try {
					await refetchHeroData();
				} catch (heroError) {
					console.error("HeroContext更新エラー:", heroError);
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

	const handleReleaseConnection = async () => {
		try {
			const data = await updateUserProfileApi(
				"",
				userInfo?.displayName,
				userInfo?.profileImage
			);

			if (data.success) {
				setUserInfo({
					...userInfo!,
					zennUsername: "",
					zennArticleCount: 0,
					level: 1, // 連携解除時にlevelもリセット
				});
				setZennUsername("");

				// Zenn連携解除時に装備もリセット
				resetEquipment();

				return { success: true };
			} else {
				console.error("連携解除エラー:", data.error);
				setError(data.error || "連携解除に失敗しました");
				return { success: false };
			}
		} catch (err) {
			console.error("連携解除エラー:", err);
			setError("Zennアカウントの連携解除中にエラーが発生しました");
			return { success: false };
		}
	};

	return {
		syncZennArticles,
		handleReleaseConnection,
		loading,
	};
};
