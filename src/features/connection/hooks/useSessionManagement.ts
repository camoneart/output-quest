"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import { UserResource } from "@clerk/types";

// ローカルストレージのキー
const LOGOUT_FLAG_KEY = "zenn_logout_flag";
const SESSION_ID_KEY = "zenn_session_id";

interface UserInfo {
  id: string;
  clerkId: string;
  displayName?: string;
  zennUsername?: string;
  profileImage?: string;
  zennArticleCount: number;
}

interface UseSessionManagementProps {
  user: UserResource | null | undefined;
  isLoaded: boolean;
  setWasLoggedOut: Dispatch<SetStateAction<boolean>>;
  setIsNewSession: Dispatch<SetStateAction<boolean>>;
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
  setZennUsername: Dispatch<SetStateAction<string>>;
}

export const useSessionManagement = ({
  user,
  isLoaded,
  setWasLoggedOut,
  setIsNewSession,
  setUserInfo,
  setZennUsername,
}: UseSessionManagementProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        // ユーザーがログインしている場合
        const currentSessionId = localStorage.getItem(SESSION_ID_KEY);
        const logoutFlag = localStorage.getItem(LOGOUT_FLAG_KEY);
        const previousUser = localStorage.getItem("zenn_previous_user");

        console.log("セッション状態チェック:", {
          logoutFlag,
          currentSessionId,
          previousUser,
          currentUserId: user.id,
        });

        // ログアウトフラグがある場合またはセッションIDが変更された場合
        // または前回のユーザーIDと異なる場合は強制的に連携解除
        if (
          logoutFlag === "true" ||
          !currentSessionId ||
          currentSessionId !== user.id ||
          (previousUser && previousUser !== user.id)
        ) {
          console.log("セッション変更を検出 - Zenn連携を強制的に解除します");

          // フラグをクリア
          localStorage.removeItem(LOGOUT_FLAG_KEY);
          localStorage.removeItem("zenn_previous_user");
          localStorage.setItem(SESSION_ID_KEY, user.id);

          // ログイン後の強制連携解除処理
          (async () => {
            try {
              console.log("ログイン後の強制連携解除を実行します");

              // 連携解除専用APIを呼び出し
              const resetResponse = await fetch("/api/user/reset-connection", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ clerkId: user?.id }),
              });

              const resetData = await resetResponse.json();
              console.log("連携解除結果:", resetData);

              // 通常のユーザー更新APIも呼び出し
              const userResponse = await fetch("/api/user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  zennUsername: "",
                  displayName: user?.firstName
                    ? `${user.firstName} ${user.lastName || ""}`.trim()
                    : undefined,
                  profileImage: user?.imageUrl,
                  forceReset: true,
                }),
              });

              const userData = await userResponse.json();
              console.log("ユーザー更新結果:", userData);

              // 状態を更新
              setWasLoggedOut(true);
              setIsNewSession(true);
              setUserInfo(null);
              setZennUsername("");
            } catch (err) {
              console.error("強制連携解除エラー:", err);
            }
          })();
        }
      } else if (isLoaded && !user) {
        // ユーザーがログアウトしている場合はセッションIDを削除
        localStorage.removeItem(SESSION_ID_KEY);
        // ログアウト時にZennユーザー名をクリア
        setZennUsername("");
        // ログアウト時に必ずフラグを設定
        localStorage.setItem(LOGOUT_FLAG_KEY, "true");
      }
    }
  }, [
    user,
    isLoaded,
    setWasLoggedOut,
    setIsNewSession,
    setUserInfo,
    setZennUsername,
  ]);
};
