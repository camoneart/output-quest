"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "./ConnectionPageClient.module.css";
import * as Connection from "@/features/connection/components";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import {
	useSessionManagement,
	useMessageStorage,
	useUserInfo,
	useZennConnection,
	useZennSync,
	useSignOutHandler,
} from "@/features/connection/hooks";

// グローバル変数の型拡張
declare global {
	interface Window {
		__clerk_custom_signout_handler?: () => Promise<void>;
	}
}

// ユーザープロフィールページ
export default function ConnectionPageClient() {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const [zennUsername, setZennUsername] = useState("");
	const [wasLoggedOut, setWasLoggedOut] = useState(false);
	const [isNewSession, setIsNewSession] = useState(false);

	// 共通のメッセージステート
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [releaseMessage, setReleaseMessage] = useState("");

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
		setUserInfo: () => {}, // 後でuseUserInfoのsetUserInfoを使用
		setZennUsername,
	});

	// メッセージストレージフック（最初に呼び出す）
	const { showSuccessMessage } = useMessageStorage({
		setSuccess,
		setReleaseMessage,
		setWasLoggedOut,
	});

	// ユーザー情報管理
	const { userInfo, setUserInfo, isZennInfoLoaded } = useUserInfo({
		wasLoggedOut,
		isNewSession,
		setWasLoggedOut,
		setIsNewSession,
		setZennUsername,
	});

	// 1.5 秒のバッファを入れてフォーム表示を許可
	const [canShowForm, setCanShowForm] = useState(false);

	useEffect(() => {
		if (isZennInfoLoaded) {
			const timer = setTimeout(() => setCanShowForm(true), 1500); // 1.5s
			return () => clearTimeout(timer);
		}
		// 読み込み直後や再フェッチ時にリセット
		setCanShowForm(false);
	}, [isZennInfoLoaded]);

	// Zenn連携管理
	const { updateUserProfile, loading: connectionLoading } = useZennConnection({
		playClickSound,
		showSuccessMessage,
		setUserInfo,
		setError,
	});

	// Zenn同期管理
	const {
		syncZennArticles,
		handleReleaseConnection,
		loading: syncLoading,
	} = useZennSync({
		userInfo,
		showSuccessMessage,
		setUserInfo,
		setZennUsername,
		setError,
	});

	// サインアウト処理
	useSignOutHandler({
		userInfo,
		setZennUsername,
		setUserInfo,
	});

	// 統合された状態管理
	const loading = connectionLoading || syncLoading;

	// 遅延付きページ遷移の処理
	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	// Zennアカウント連携処理
	const handleUpdateUserProfile = async (username: string) => {
		setError("");
		setSuccess("");
		setReleaseMessage("");
		setZennUsername(username); // 親state更新
		const result = await updateUserProfile(username);
		return result;
	};

	// Zenn記事同期処理
	const handleSyncZennArticles = async (shouldRedirect = false) => {
		setError("");
		setSuccess("");
		await syncZennArticles(zennUsername, shouldRedirect);
	};

	// 連携解除処理
	const handleRelease = async () => {
		setError("");
		setSuccess("");
		const result = await handleReleaseConnection();
		if (result.success) {
			setReleaseMessage("Zennのアカウント連携を解除しました");
		}
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
						updateUserProfile={() => handleUpdateUserProfile(zennUsername)}
					/>
				) : (
					<div className={styles["profile-info-container"]}>
						<div className={styles["profile-info-header"]}>
							<Connection.ConnectionUserProfileHeader user={user} />

							<hr className={styles["center-line"]} />
						</div>

						<div className={styles["connection-info-container"]}>
							{!canShowForm ? (
								<div className="p-4 text-center">読み込み中...</div>
							) : userInfo?.zennUsername ? (
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
											onSync={() => handleSyncZennArticles(false)}
											onRelease={handleRelease}
										/>
									</div>
								</>
							) : (
								<Connection.ConnectionZennForm
									zennUsername={zennUsername}
									loading={loading}
									error={error}
									onUsernameChange={setZennUsername}
									onSubmit={handleUpdateUserProfile}
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
