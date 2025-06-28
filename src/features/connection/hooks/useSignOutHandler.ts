import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserInfo } from "../types";
import { SESSION_ID_KEY, LOGOUT_FLAG_KEY } from "../constants";

interface UseSignOutHandlerProps {
	userInfo: UserInfo | null;
	setZennUsername: (username: string) => void;
	setUserInfo: (userInfo: UserInfo | null) => void;
}

export const useSignOutHandler = ({
	userInfo,
	setZennUsername,
	setUserInfo,
}: UseSignOutHandlerProps) => {
	const { user } = useUser();

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
			// 同期的な連携解除実行関数
			const syncResetZennConnection = () => {
				// 確実にフラグを設定
				localStorage.setItem(LOGOUT_FLAG_KEY, "true");

				// 現在のユーザーIDを保存（ログ用）
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

					// DBのデータ（zennUsername、zennArticleCount、level）は一切変更しない
					// 画面上の表示のみクリアする
					// サインアウト後も次回ログイン時にZenn連携が維持されるようにする

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
	}, [user, userInfo, setZennUsername, setUserInfo]);
};
