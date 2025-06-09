"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import UserIconButton from "@/components/auth/UserIconButton/UserIconButton";
import styles from "./AuthButton.module.css";

const AuthButton = () => {
  const { isLoaded, userId } = useAuth();
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

  // if (userId) {
  //   return (
  //     <UserIconButton
  //       avatarSize="w-[50px] h-[50px]"
  //       showName={false}
  //       loaderSize="w-[50px] h-[50px]"
  //       classnameButton=""
  //     />
  //   );
  // }

  return (
    <div className="flex items-center justify-center w-full gap-5">
      <SignInButton
        mode="redirect"
        forceRedirectUrl={redirectUrl}
      >
        <button
          className={`${styles["login-btn"]}`}
          onClick={() => playClickSound()}
        >
          <span className={`${styles["login-btn-text"]}`}>ログイン</span>
        </button>
      </SignInButton>
      <SignUpButton
        mode="redirect"
        forceRedirectUrl={redirectUrl}
      >
        <button
          className={`${styles["sign-up-btn"]}`}
          onClick={() => playClickSound()}
        >
          <span className={`${styles["sign-up-btn-text"]}`}>新規登録</span>
        </button>
      </SignUpButton>
    </div>
  );
};

export default AuthButton;
