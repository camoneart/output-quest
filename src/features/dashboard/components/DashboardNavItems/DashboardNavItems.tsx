"use client";

import React, { useState, useEffect } from "react";
import { navigationItems } from "@/features/navigation/data/navigationItems";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import styles from "./DashboardNavItems.module.css";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// セッション識別子を保存するキー
const SESSION_ID_KEY = "zenn_session_id";

const DashboardNavItems = () => {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    zennUsername?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  const router = useRouter();
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  // セッション管理 - 認証状態の変化を検知
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoaded && userId) {
        // ログイン状態の場合、セッションIDをチェック
        const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

        // 新しいセッションまたは別のユーザーでログインした場合
        if (!currentSessionId || currentSessionId !== userId) {
          console.log("DashboardNavItems: 新しいセッションを検出しました");
          localStorage.setItem(SESSION_ID_KEY, userId);
          // ユーザー情報をリセット（後続のuseEffectで再取得）
          setUserProfile(null);
        }
      } else if (isLoaded && !userId) {
        // ログアウト状態の場合、セッションIDを削除してプロフィールをクリア
        localStorage.removeItem(SESSION_ID_KEY);
        setUserProfile(null);
      }
    }
  }, [isLoaded, userId]);

  // `userProfile === null` is stored in a variable so the dependency array is static‑checkable
  const isProfileNull = userProfile === null;

  // Zenn連携状態を取得
  useEffect(() => {
    const fetchUserProfile = async (retryCount = 0) => {
      if (!isLoaded) return;

      setIsLoading(true);

      if (!userId) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        console.log(
          `DashboardNavItems: プロフィール取得開始 (試行: ${retryCount + 1})`
        );
        const response = await fetch("/api/user");
        const data = await response.json();

        if (response.ok && data.success) {
          console.log(
            "DashboardNavItems: プロフィール取得成功",
            data.user.zennUsername
          );
          setUserProfile(data.user);
          setIsLoading(false); // 成功したらローディング終了
        } else {
          console.log(
            `DashboardNavItems: プロフィール取得失敗 (ステータス: ${
              response.status
            }, 試行: ${retryCount + 1})`
          );
          // 404エラーかつリトライ上限未満の場合にリトライ
          if (response.status === 404 && retryCount < 2) {
            // 最大2回リトライ (合計3回試行)
            console.log(`DashboardNavItems: 2秒後にリトライします...`);
            setTimeout(() => fetchUserProfile(retryCount + 1), 2000); // 2秒後に再帰呼び出し
            // リトライ中はローディングを継続するため、ここではsetIsLoading(false)を呼ばない
          } else {
            setUserProfile(null); // 失敗またはリトライ上限到達でnull設定
            setIsLoading(false); // ローディング終了
          }
        }
      } catch (err) {
        console.error(
          `DashboardNavItems: ユーザープロフィール取得エラー (試行: ${
            retryCount + 1
          }):`,
          err
        );
        setUserProfile(null);
        setIsLoading(false); // エラー時もローディング終了
      }
      // finallyブロックはリトライ処理と競合するため削除または調整が必要
      // setIsLoading(false) の呼び出し場所を調整しました
    };

    fetchUserProfile();
  }, [isLoaded, userId, isProfileNull]); // userProfileがnullの時に再実行

  // ナビゲーション項目が制限されるべきかチェック
  const isItemRestricted = (itemId: number): boolean => {
    // ログインしていない、またはZenn連携していない場合に制限する項目のID
    const restrictedItemIds = [1, 2, 3, 4, 5]; // ダッシュボード、投稿一覧、つよさ、なかま、アイテム

    // ログインしていない場合は制限
    if (!userId) return restrictedItemIds.includes(itemId);

    // ログインしていてもZenn連携していない場合は制限
    if (
      userId &&
      (!userProfile?.zennUsername || userProfile.zennUsername === "")
    ) {
      return restrictedItemIds.includes(itemId);
    }

    return false;
  };

  if (isLoading && userId) {
    return <div className="w-full text-center">読み込み中...</div>;
  }

  return (
    <>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isRestricted = isItemRestricted(item.id);

        // 制限されたアイテムのスタイル
        const restrictedStyle = isRestricted
          ? {
              opacity: 0.5,
              cursor: "not-allowed",
              pointerEvents: "none" as const,
            }
          : {};

        return (
          <li key={item.href}>
            {isActive ? (
              <Button
                key={item.href}
                variant="default"
                className={`${styles["dashboard-nav-item"]} ${styles["dashboard-nav-item-active"]}`}
                style={restrictedStyle}
              >
                <div className={`${styles["dashboard-nav-item-not-link"]}`}>
                  <div
                    className={`${styles["dashboard-nav-item-content"]} ${styles["dashboard-nav-item-content-active"]}`}
                  >
                    <Image
                      src={item.icon || "/images/nav-icon/default-icon.svg"}
                      alt={item.alt || item.title}
                      width={item.width || 20}
                      height={item.height || 20}
                      className={`${styles["dashboard-nav-item-icon"]}`}
                    />
                    <h3 className={`${styles["dashboard-nav-item-title"]}`}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Button>
            ) : (
              <Button
                key={item.href}
                asChild={!isRestricted}
                variant="default"
                className={`${styles["dashboard-nav-item"]}`}
                style={restrictedStyle}
                disabled={isRestricted}
              >
                {isRestricted ? (
                  <div className={`${styles["dashboard-nav-item-link"]}`}>
                    <div className={`${styles["dashboard-nav-item-content"]}`}>
                      <Image
                        src={item.icon || "/images/nav-icon/default-icon.svg"}
                        alt={item.alt || item.title}
                        width={item.width || 20}
                        height={item.height || 20}
                        className={`${styles["dashboard-nav-item-icon"]}`}
                      />
                      <h3 className={`${styles["dashboard-nav-item-title"]}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`${styles["dashboard-nav-item-link"]}`}
                    onClick={(e) => {
                      if (item.id === 6 || item.id === 7) {
                        handleNavigation(e, item.href);
                      } else {
                        playClickSound();
                      }
                    }}
                  >
                    <div className={`${styles["dashboard-nav-item-content"]}`}>
                      <Image
                        src={item.icon || "/images/nav-icon/default-icon.svg"}
                        alt={item.alt || item.title}
                        width={item.width || 20}
                        height={item.height || 20}
                        className={`${styles["dashboard-nav-item-icon"]}`}
                      />
                      <h3 className={`${styles["dashboard-nav-item-title"]}`}>
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                )}
              </Button>
            )}
          </li>
        );
      })}
    </>
  );
};

export default DashboardNavItems;
