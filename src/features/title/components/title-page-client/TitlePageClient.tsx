"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import styles from "./TitlePageClient.module.css";
import * as Title from "@/features/title/components/index";

const TitlePageClient = () => {
	const { user, isLoaded } = useUser();
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);

	// ユーザーのZenn連携情報を取得
	useEffect(() => {
		const fetchUserZennInfo = async () => {
			if (!isLoaded) {
				// Clerkの認証状態がまだ確定していない場合は何もしない
				setIsZennInfoLoaded(false);
				return;
			}

			if (!user) {
				// ユーザーがログインしていない場合
				setUserZennInfo(null);
				setIsZennInfoLoaded(true);
				return;
			}

			// ユーザーがログイン済みの場合、Zenn情報を取得
			try {
				const response = await fetch("/api/user");
				const data = await response.json();

				if (data.success && data.user) {
					setUserZennInfo({ zennUsername: data.user.zennUsername });
				} else {
					setUserZennInfo(null);
				}
			} catch (err) {
				console.error("ユーザー情報取得エラー:", err);
				setUserZennInfo(null);
			} finally {
				setIsZennInfoLoaded(true);
			}
		};

		fetchUserZennInfo();
	}, [isLoaded, user]);

	// ロード中の判定
	const isLoading = !isLoaded || (user && !isZennInfoLoaded);

	// ゲストユーザーかどうかの判定（Clerkサインイン + Zenn連携の両方が必要）
	const isGuestUser = !user || !userZennInfo?.zennUsername;

	// ロード中の場合は読み込み中UIを表示
	if (isLoading) {
		return (
			<div className={`${styles["title-page-container"]}`}>
				<p className="text-sm grid place-items-center h-full bg-[#1a1a1a] px-[10px] py-[40px]">読み込み中...</p>
			</div>
		);
	}

	return (
		<>
			{isGuestUser ? (
				// ゲストユーザー用のUI
				<div className={`${styles["title-page-guest-container"]}`}>
					<p className="text-sm grid place-items-center h-full bg-[#1a1a1a] px-[10px] py-[40px]">
						ログインすると利用できる機能です
					</p>
					<Title.TitlePageFooter />
				</div>
			) : (
				// ログインユーザー用のUI
				<div className={`${styles["title-page-container"]}`}>
					<Title.TitlePageHeader />

					<hr className={styles["title-page-line-first"]} />

					{/* クライアントコンポーネントで称号リストを表示 */}
					<Title.TitleList />

					<hr className={styles["title-page-line-second"]} />

					<Title.TitlePageFooter />
				</div>
			)}
		</>
	);
};

export default TitlePageClient;
