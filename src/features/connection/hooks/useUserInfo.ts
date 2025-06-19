import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserInfo } from "../types";
import {
	fetchUserInfo,
	resetConnection,
	updateUserProfile as updateUserProfileApi,
} from "../api";

interface UseUserInfoProps {
	wasLoggedOut: boolean;
	isNewSession: boolean;
	setWasLoggedOut: (value: boolean) => void;
	setIsNewSession: (value: boolean) => void;
	setZennUsername: (value: string) => void;
}

export const useUserInfo = ({
	wasLoggedOut,
	isNewSession,
	setWasLoggedOut,
	setIsNewSession,
	setZennUsername,
}: UseUserInfoProps) => {
	const { user, isLoaded } = useUser();
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);

	useEffect(() => {
		const fetchAndSetUserInfo = async () => {
			if (!isLoaded) return;

			// ユーザーがログインしていない場合、状態をリセット
			if (!user) {
				setUserInfo(null);
				setZennUsername("");
				setIsZennInfoLoaded(true);
				return;
			}

			// ユーザーがログイン済みの場合、Zenn情報ロード開始
			setIsZennInfoLoaded(false);

			try {
				// ログアウト/新セッションフラグをチェック
				if (wasLoggedOut || isNewSession) {
					// フラグをすぐにリセット
					setWasLoggedOut(false);
					setIsNewSession(false);

					// リセット処理を実行
					try {
						setZennUsername("");

						await resetConnection(user.id);

						await updateUserProfileApi(
							"",
							user?.firstName
								? `${user.firstName} ${user.lastName || ""}`.trim()
								: undefined,
							user?.imageUrl,
							true
						);

						setUserInfo(null);
						setZennUsername("");
					} catch (err) {
						console.error("連携リセットエラー:", err);
						setUserInfo(null);
						setZennUsername("");
					}
				} else {
					// 通常のユーザー情報取得
					try {
						const data = await fetchUserInfo();

						if (data.success) {
							if (data.isNewUser) {
								setUserInfo(null);
								setZennUsername("");
								return;
							}

							setUserInfo(data.user!);
							setZennUsername(data.user?.zennUsername || "");
						} else {
							setUserInfo(null);
							setZennUsername("");
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

		fetchAndSetUserInfo();
	}, [isLoaded, user?.id, wasLoggedOut, isNewSession]);

	return {
		userInfo,
		setUserInfo,
		isZennInfoLoaded,
	};
};
