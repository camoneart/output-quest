"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import { LOGOUT_FLAG_KEY } from "@/features/connection/constants";

// ローカルストレージのキー
const SUCCESS_MESSAGE_KEY = "zenn_success_message";
const RELEASE_MESSAGE_KEY = "zenn_release_message";

interface UseMessageStorageProps {
	setSuccess: Dispatch<SetStateAction<string>>;
	setReleaseMessage: Dispatch<SetStateAction<string>>;
	setWasLoggedOut: Dispatch<SetStateAction<boolean>>;
}

export const useMessageStorage = ({
	setSuccess,
	setReleaseMessage,
	setWasLoggedOut,
}: UseMessageStorageProps) => {
	useEffect(() => {
		if (typeof window !== "undefined") {
			// 成功メッセージを取得
			const savedSuccessMessage = localStorage.getItem(SUCCESS_MESSAGE_KEY);
			if (savedSuccessMessage) {
				setSuccess(savedSuccessMessage);
				localStorage.removeItem(SUCCESS_MESSAGE_KEY);
			}

			// 連携解除メッセージを取得
			const savedReleaseMessage = localStorage.getItem(RELEASE_MESSAGE_KEY);
			if (savedReleaseMessage) {
				setReleaseMessage(savedReleaseMessage);
				localStorage.removeItem(RELEASE_MESSAGE_KEY);
			}

			// ログアウトフラグを確認
			const logoutFlag = localStorage.getItem(LOGOUT_FLAG_KEY);
			if (logoutFlag === "true") {
				setWasLoggedOut(true);
				localStorage.removeItem(LOGOUT_FLAG_KEY);
			}
		}
	}, [setSuccess, setReleaseMessage, setWasLoggedOut]);

	// 成功メッセージを設定する関数
	const showSuccessMessage = (message: string) => {
		if (typeof window !== "undefined") {
			// ローカルストレージではなく、直接状態を設定
			setSuccess(message);
		}
	};

	return { showSuccessMessage };
};
