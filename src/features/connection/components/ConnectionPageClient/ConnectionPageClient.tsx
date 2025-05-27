"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "./ConnectionPageClient.module.css";
import AuthButton from "@/components/auth/AuthButton/AuthButton";
import UserIconButton from "@/components/auth/UserIconButton/UserIconButton";
import Image from "next/image";
import Link from "next/link";
import * as Connection from "@/features/connection/components";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

// グローバル変数の型拡張
declare global {
  interface Window {
    __clerk_custom_signout_handler?: () => Promise<void>;
  }
}

// ユーザープロフィールの型定義
interface UserInfo {
  id: string;
  clerkId: string;
  displayName?: string;
  zennUsername?: string;
  profileImage?: string;
  zennArticleCount: number;
}

// ローカルストレージのキー
const SUCCESS_MESSAGE_KEY = "zenn_success_message";
const RELEASE_MESSAGE_KEY = "zenn_release_message";
const LOGOUT_FLAG_KEY = "zenn_logout_flag"; // ログアウト状態を記録するキー
const SESSION_ID_KEY = "zenn_session_id"; // セッション識別子を保存するキー

// ユーザープロフィールページ
export default function ConnectionPageClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [zennUsername, setZennUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [releaseMessage, setReleaseMessage] = useState("");
  const [wasLoggedOut, setWasLoggedOut] = useState(false);
  const [isNewSession, setIsNewSession] = useState(false);
  const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);

  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  // 遅延付きページ遷移の処理
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  // セッション管理 - ページ読み込み時にセッションIDをチェックする
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
              setLoading(true);
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
              setLoading(false);
            } catch (err) {
              console.error("強制連携解除エラー:", err);
              setLoading(false);
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
  }, [user, isLoaded]);

  // ページロード時にローカルストレージからメッセージを取得
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
  }, []);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoaded) return;

      // ユーザーがログインしていない場合、状態をリセット
      if (!user) {
        setUserInfo(null);
        setZennUsername("");
        // ユーザー非ログイン時はロード完了扱い
        setIsZennInfoLoaded(true);
        return;
      }

      // Zenn連携情報のロード開始（ユーザーがいる場合のみ）
      setIsZennInfoLoaded(false);

      try {
        const wasLoggedOutFlag = wasLoggedOut;
        const isNewSessionFlag = isNewSession;

        if (wasLoggedOutFlag || isNewSessionFlag) {
          console.log(
            "ログアウト後の再ログイン/新しいセッションを検出しました"
          );
          console.log("Zenn連携をリセットします");
          // 連携リセット処理を実行
          await resetZennConnection();
        } else {
          // 通常のユーザー情報取得（連携リセットなし）
          await fetchLatestUserInfo();
        }
      } catch (err) {
        console.error("ユーザープロフィール取得エラー:", err);
      } finally {
        // ロード完了を通知してUIをアンブロック
        setIsZennInfoLoaded(true);
      }
    };

    // Zenn連携をリセットする共通関数
    const resetZennConnection = async () => {
      try {
        console.log("Zenn連携リセット処理を開始します");

        // 入力欄をクリア
        setZennUsername("");

        // 連携解除専用APIを呼び出し
        const resetResponse = await fetch("/api/user/reset-connection", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkId: user?.id }),
        });

        const resetData = await resetResponse.json();
        console.log("Zenn連携リセット結果:", resetData);

        // 通常の連携解除処理も実行
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
            forceReset: true, // 強制リセットフラグ
          }),
        });

        const userData = await userResponse.json();
        console.log("ユーザー更新結果:", userData);

        // 状態を直接更新
        setUserInfo(null);
        setZennUsername("");
        setError("");
        setSuccess("");

        // フラグをリセット
        setWasLoggedOut(false);
        setIsNewSession(false);
      } catch (err) {
        console.error("連携リセットエラー:", err);

        // エラーが発生した場合でも状態をリセット
        setUserInfo(null);
        setZennUsername("");
        setWasLoggedOut(false);
        setIsNewSession(false);
      }
    };

    // 最新のユーザー情報を取得する関数
    const fetchLatestUserInfo = async () => {
      try {
        console.log("最新のユーザー情報を取得します");
        const response = await fetch("/api/user");
        const data = await response.json();

        if (data.success) {
          // zennUsernameが存在するかチェック
          if (data.user && data.user.zennUsername) {
            console.log(`Zenn連携情報が存在します: @${data.user.zennUsername}`);
          } else {
            console.log("Zenn連携情報はありません");
          }

          setUserInfo(data.user);
          setZennUsername(data.user.zennUsername || "");
        } else {
          // ユーザーが見つからない場合は何もしない
          console.log("ユーザー情報が見つかりません");
          return;
        }
      } catch (err) {
        console.error("最新ユーザー情報取得エラー:", err);
      }
    };

    fetchUserInfo();
  }, [isLoaded, user, wasLoggedOut, isNewSession]);

  // 成功メッセージを設定
  const showSuccessMessage = (message: string) => {
    if (typeof window !== "undefined") {
      // ローカルストレージではなく、直接状態を設定
      setSuccess(message);
    }
  };

  // ユーザー名が有効な形式かチェックする関数
  const isValidZennUsernameFormat = (username: string): boolean => {
    // Zennのユーザー名に使える文字は英数字、アンダースコア、ハイフンのみ
    return /^[a-zA-Z0-9_-]+$/.test(username);
  };

  // ユーザープロフィールを更新
  const updateUserProfile = async () => {
    playClickSound();
    if (!zennUsername) {
      setError("ユーザー名を入力してください");
      return;
    }

    // @を取り除く
    const cleanUsername = zennUsername.replace(/^@/, "");

    // ユーザー名の形式をチェック
    if (!isValidZennUsernameFormat(cleanUsername)) {
      setError(
        "ユーザー名が無効です。小文字英数字 (a-z, 0-9)、アンダースコア (_)、ハイフン (-) のみ使用できます。"
      );
      return;
    }

    // ロード開始時にreleaseMessageをクリア
    setLoading(true);
    setError("");
    setSuccess("");
    setReleaseMessage("");

    try {
      // まずZennアカウントが存在するか確認
      const checkResponse = await fetch(`/api/zenn?username=${cleanUsername}`);
      const checkData = await checkResponse.json();

      if (!checkData.success) {
        setError(checkData.error || "ユーザー名の検証に失敗しました");
        setLoading(false);
        return;
      }

      // APIが常に48件を返す問題に対応するための事前チェック
      const randomUsername = `test_${Math.random()
        .toString(36)
        .substring(2, 10)}`;
      const testResponse = await fetch(`/api/zenn?username=${randomUsername}`);
      const testData = await testResponse.json();
      const suspiciousFixedCount = 48;
      if (
        checkData.totalCount === suspiciousFixedCount &&
        testData.success &&
        testData.totalCount === suspiciousFixedCount
      ) {
        setError("Zennとの連携に失敗しました。存在しないユーザー名です。");
        setLoading(false);
        return;
      }

      // 記事数が0または記事が見つからない場合はユーザーが存在しないと判断
      if (!checkData.articles || checkData.articles.length === 0) {
        setError(
          "このユーザー名のアカウントは記事を投稿していないため連携できません"
        );
        setLoading(false);
        return;
      }

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zennUsername: cleanUsername,
          displayName: user?.firstName
            ? `${user.firstName} ${user.lastName || ""}`.trim()
            : undefined,
          profileImage: user?.imageUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(data.user);
        // プロフィール更新後にZenn記事を同期
        await syncZennArticles(true);
      } else {
        setError(data.error || "プロフィールの更新に失敗しました");
      }
    } catch (err) {
      console.error("プロフィール更新エラー:", err);
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // Zenn記事データを同期
  const syncZennArticles = async (shouldRedirect = false) => {
    if (!zennUsername) {
      setError("ユーザー名を入力してください");
      return;
    }

    // @を取り除く
    const cleanUsername = zennUsername.replace(/^@/, "");

    // ユーザー名の形式をチェック
    if (!isValidZennUsernameFormat(cleanUsername)) {
      setError(
        "ユーザー名が無効です。小文字英数字 (a-z, 0-9)、アンダースコア (_)、ハイフン (-) のみ使用できます。"
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // APIが常に48件を返す問題に対応するための事前チェック
      // 明らかに存在しないランダムなユーザー名でテスト
      const randomUsername = `test_${Math.random()
        .toString(36)
        .substring(2, 10)}`;
      const testResponse = await fetch(`/api/zenn?username=${randomUsername}`);
      const testData = await testResponse.json();

      // テスト用の明らかに無効なユーザー名でも成功レスポンスを返す場合
      if (testData.success && testData.totalCount > 0) {
        console.warn(
          "APIが無効なユーザー名でも成功レスポンスを返しています",
          testData
        );
      }

      // Zenn APIを呼び出し、記事データを取得
      const response = await fetch(
        `/api/zenn?username=${cleanUsername}&updateUser=true`
      );
      const data = await response.json();

      // 存在しないユーザーの場合、バックエンドAPIが常に48件を返す問題の一時的な対策
      const suspiciousFixedCount = 48;
      if (data.success && data.totalCount === suspiciousFixedCount) {
        // ランダムなユーザー名のテスト結果と比較
        if (testData.success && testData.totalCount === suspiciousFixedCount) {
          setError("Zennとの連携に失敗しました。存在しないユーザー名です。");
          setLoading(false);
          return;
        }
      }

      if (data.success && data.articles && data.articles.length > 0) {
        if (data.user) {
          setUserInfo(data.user);
          // 表示メッセージを連携 or 同期に応じて切り替え
          const successMessage = shouldRedirect
            ? `Zennのアカウント連携が完了しました。${data.totalCount}件の記事が見つかりました。`
            : `同期が完了しました。${data.totalCount}件の記事が見つかりました。`;
          showSuccessMessage(successMessage);
          setReleaseMessage("");
        } else {
          // ユーザープロフィールを更新
          await updateUserProfile();
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

  // Zennアカウント連携を解除する関数を定義
  const handleReleaseConnection = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zennUsername: "",
          displayName: userInfo?.displayName,
          profileImage: userInfo?.profileImage,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUserInfo({
          ...userInfo!,
          zennUsername: "",
          zennArticleCount: 0,
        });
        setZennUsername("");
        setSuccess("");
        setReleaseMessage("Zennのアカウント連携を解除しました");
      } else {
        console.error("連携解除エラー:", data.error);
        setError(data.error || "連携解除に失敗しました");
      }
    } catch (err) {
      console.error("連携解除エラー:", err);
      setError("Zennアカウントの連携解除中にエラーが発生しました");
    }
  };

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
      // 同期的な連携解除実行関数（async/awaitを使わず即時実行）
      const syncResetZennConnection = () => {
        // 確実にフラグを設定
        localStorage.setItem(LOGOUT_FLAG_KEY, "true");

        // 現在のユーザーIDを保存
        if (user?.id) {
          localStorage.setItem("zenn_previous_user", user.id);
        }

        // 画面上の状態をクリア
        setZennUsername("");
        setUserInfo(null);

        console.log("ログアウト前の同期的連携解除処理完了");
        return true;
      };

      // Clerkのサインアウトイベントをカスタマイズ
      const handleClerkSignOut = async () => {
        try {
          console.log("サインアウトハンドラー実行開始");

          // 最初に同期的な処理を実行
          syncResetZennConnection();

          // 次にセッション関連の状態をクリア
          localStorage.setItem(LOGOUT_FLAG_KEY, "true");
          localStorage.removeItem(SESSION_ID_KEY);

          // ユーザー情報があれば連携解除を実行（確実に実行が完了するように変更）
          if (user) {
            try {
              console.log("ログアウト時のZenn連携解除APIを呼び出します");

              // 連携解除APIを呼び出し - 結果を待機する
              const resetResponse = await fetch("/api/user/reset-connection", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ clerkId: user?.id }),
                // キャッシュを無効化
                cache: "no-store",
              });

              const resetData = await resetResponse.json();
              console.log("連携解除API結果:", resetData);

              // 通常の連携解除処理も実行
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
                // キャッシュを無効化
                cache: "no-store",
              });

              const userData = await userResponse.json();
              console.log("ユーザー更新結果:", userData);
            } catch (err) {
              console.error("Zenn連携解除中にエラー:", err);
            }
          }

          // 最後の保険として、再度ログアウトフラグを設定
          localStorage.setItem(LOGOUT_FLAG_KEY, "true");
          localStorage.removeItem(SESSION_ID_KEY);
        } catch (err) {
          console.error("サインアウトハンドラーエラー:", err);
          // エラーが発生しても必ずログアウトフラグは維持する
          localStorage.setItem(LOGOUT_FLAG_KEY, "true");
          localStorage.removeItem(SESSION_ID_KEY);
        }

        console.log("サインアウトハンドラー実行完了");
      };

      // クリークのサインアウト前処理をグローバル変数に登録
      window.__clerk_custom_signout_handler = handleClerkSignOut;
    }

    return () => {
      if (typeof window !== "undefined") {
        window.__clerk_custom_signout_handler = undefined;
      }
    };
  }, [user, userInfo]);

  return (
    <>
      <h2 className={`${styles["profile-title"]}`}>連携</h2>
      <div className={`${styles["profile-container"]}`}>
        {!isLoaded ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : !user ? (
          <div
            className={`px-4 py-6 grid gap-8 ${styles["connection-container"]}`}
          >
            <div className={`${styles["auth-content"]}`}>
              <AuthButton />
              <p className="text-center">
                アプリを利用するには「ログイン」または「新規登録」が必要です。
              </p>
            </div>
            <hr className={styles["center-line"]} />
            <div
              className={`grid grid-cols-1 gap-2 ${styles["zenn-connect-area"]}`}
            >
              <label
                htmlFor="zenn-username"
                className="text-sm opacity-40 select-none"
              >
                Zennユーザー名
                <strong className="text-[#ffc630]">（必須）</strong>
              </label>
              <div className="flex gap-3 opacity-40 select-none">
                <input
                  id="zenn-username"
                  type="text"
                  value=""
                  onChange={() => {}}
                  className="flex-1 border-[3px] border-gray-400 rounded px-3 py-2 text-black cursor-not-allowed"
                  placeholder="例: aoyamadev"
                  disabled
                />
                <button
                  onClick={() => updateUserProfile()}
                  className={`${styles["connect-button"]} ${
                    !loading && zennUsername ? styles["active"] : ""
                  } ${
                    loading || !zennUsername
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={loading || !zennUsername}
                >
                  <div className={`${styles["connect-button-content"]}`}>
                    {loading ? "連携中..." : "連携"}
                  </div>
                </button>
              </div>
              <p className="text-center mt-[12px]">
                先に「ログイン」または「新規登録」を完了してください。
              </p>
            </div>
          </div>
        ) : (
          <div className={styles["profile-info-container"]}>
            <div className={styles["profile-info-header"]}>
              {user.id && (
                <UserIconButton
                  avatarSize="w-[75px] h-[75px] md:w-[95px] md:h-[95px]"
                  showName={false}
                  loaderSize="w-[75px] h-[75px] md:w-[95px] md:h-[95px]"
                  classnameButton=""
                />
              )}

              <div className="grid grid-cols-1 gap-1">
                <h3 className="text-xl font-bold tracking-wide">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm tracking-wide">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>

            <hr className={styles["center-line"]} />

            {!isZennInfoLoaded ? (
              <div className="p-4 text-center">読み込み中...</div>
            ) : userInfo ? (
              userInfo.zennUsername ? (
                <>
                  <div className={styles["zenn-info-container"]}>
                    <div className={styles["zenn-info-content"]}>
                      <h3 className={styles["zenn-info-title"]}>
                        Zenn連携情報
                      </h3>
                      <div className="grid gap-6 md:gap-3">
                        <dl className={styles["user-info-list"]}>
                          <dt className={styles["user-info-title"]}>
                            <Image
                              src="/images/connection/user-icon.svg"
                              alt="ユーザーアイコン"
                              width={17}
                              height={17}
                              className={styles["user-info-icon"]}
                            />
                            <span className={styles["user-info-title-text"]}>
                              ユーザー名：
                            </span>
                          </dt>
                          <dd className={styles["user-info-description"]}>
                            @{userInfo.zennUsername}
                          </dd>
                        </dl>

                        <dl className={styles["article-count-list"]}>
                          <dt className={styles["article-count-title"]}>
                            <Image
                              src="/images/connection/article.svg"
                              alt="記事のアイコン"
                              width={17}
                              height={17}
                              className={styles["article-count-icon"]}
                            />
                            <span
                              className={styles["article-count-title-text"]}
                            >
                              投稿した記事：
                            </span>
                          </dt>
                          <dd className={styles["article-count-description"]}>
                            {loading ? "..." : userInfo.zennArticleCount}件
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className={styles["back-to-dashboard-link-container"]}>
                    <div className={styles["back-to-dashboard-link-box"]}>
                      <Link
                        href="/dashboard"
                        className={`${styles["back-to-dashboard-link"]}`}
                        onClick={(e) => handleNavigation(e, "/dashboard")}
                      >
                        <Image
                          src="/images/arrow/arrow-icon.svg"
                          alt="冒険をはじめる"
                          width={17}
                          height={17}
                          className={styles["back-to-dashboard-link-icon"]}
                        />
                        <span className={styles["back-to-dashboard-link-text"]}>
                          冒険をはじめる
                        </span>
                      </Link>
                    </div>
                  </div>

                  <Connection.ButtonGroup
                    loading={loading}
                    userInfo={userInfo}
                    onSync={() => syncZennArticles(false)}
                    onRelease={handleReleaseConnection}
                  />
                </>
              ) : (
                <Connection.ZennConnectionForm
                  zennUsername={zennUsername}
                  loading={loading}
                  error={error}
                  onUsernameChange={setZennUsername}
                  onSubmit={updateUserProfile}
                />
              )
            ) : (
              <Connection.ZennConnectionForm
                zennUsername={zennUsername}
                loading={loading}
                error={error}
                onUsernameChange={setZennUsername}
                onSubmit={updateUserProfile}
              />
            )}

            {error && (
              <strong className={styles["error-message"]}>{error}</strong>
            )}
            {!error && success && (
              <p className={styles["success-message"]}>{success}</p>
            )}
            {!error && !success && releaseMessage && (
              <p className={styles["release-message"]}>{releaseMessage}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
