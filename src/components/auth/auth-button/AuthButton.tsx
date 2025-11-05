"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import styles from "./AuthButton.module.css";

const AuthButton = () => {
	const { isLoaded } = useAuth();
	const redirectUrl = process.env.NEXT_PUBLIC_CONNECTION_URL || "/connection";
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_star.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});
	// クライアントサイドでのみレンダリングするための状態
	const [mounted, setMounted] = useState(false);

	// クライアントサイドでのみ実行される
	useEffect(() => {
		setMounted(true);
	}, []);

	// サーバーサイドレンダリング時は何も表示しない
	if (!mounted) {
		return null;
	}

	if (!isLoaded) {
		return null;
	}

	return (
		<div className="flex items-center justify-center w-full">
			<SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
				<button
					className={`${styles["login-btn"]}`}
					onClick={() => playClickSound()}
				>
					<span className={`${styles["login-btn-text"]}`}>ログイン</span>
				</button>
			</SignInButton>
		</div>
	);
};

export default AuthButton;
