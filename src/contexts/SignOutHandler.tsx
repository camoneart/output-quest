"use client";

import { useEffect, useState } from "react";
import { useUser, useSession } from "@clerk/nextjs";

// サインアウト処理中フラグ
let isProcessingSignOut = false;

export function SignOutHandler({ children }: { children: React.ReactNode }) {
	const { user } = useUser();
	const { session } = useSession();
	const [previousSessionId, setPreviousSessionId] = useState<string | null>(
		null
	);
	const [previousUserId, setPreviousUserId] = useState<string | null>(null);

	useEffect(() => {
		// 初回マウント時の処理
		if (previousSessionId === null && session) {
			setPreviousSessionId(session.id);
		}
		if (previousUserId === null && user?.id) {
			setPreviousUserId(user.id);
		}

		// セッションが存在していたが、なくなった場合（サインアウト）
		if (
			previousSessionId &&
			!session &&
			!isProcessingSignOut &&
			previousUserId
		) {
			// DBのデータを保持するため、リセット処理を無効化
			// サインアウト時もZenn連携情報を維持する

			// 以下の処理は無効化（DBのデータを保持するため）
			/*
			isProcessingSignOut = true;

			// DBのZenn連携データをリセット
			const resetZennData = async () => {
				try {
					const response = await fetch("/api/user/reset-connection", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ clerkId: previousUserId }),
					});

					if (!response.ok) {
						console.error("Zenn連携リセットエラー: ", response.status);
					}
				} catch (error) {
					console.error("Zenn連携リセットエラー:", error);
				} finally {
					isProcessingSignOut = false;
					// ユーザーIDをクリア
					setPreviousUserId(null);
				}
			};

			resetZennData();
			*/

			// ユーザーIDをクリア（状態管理のみ）
			setPreviousUserId(null);
		}

		// 現在のセッションIDとユーザーIDを更新
		if (session?.id) {
			setPreviousSessionId(session.id);
		}
		if (user?.id) {
			setPreviousUserId(user.id);
		}
	}, [session, user, previousSessionId, previousUserId]);

	return <>{children}</>;
}
