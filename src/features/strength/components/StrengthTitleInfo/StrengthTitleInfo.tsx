"use client";

import React, { useState, useEffect } from "react";
import styles from "./StrengthTitleInfo.module.css";
import Link from "next/link";
import { titleNameData } from "@/shared/data/titleNameDate";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { fetchZennArticles } from "@/features/posts/services";

const StrengthTitleInfo = () => {
  const router = useRouter();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  // ローカルレベル取得状態
  const [heroLevel, setHeroLevel] = useState<number>(1);
  const [isLoadingTitle, setIsLoadingTitle] = useState<boolean>(true);
  // 記事数からレベルを計算して設定
  useEffect(() => {
    const loadLevel = async () => {
      try {
        setIsLoadingTitle(true);
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        if (!userData.success) {
          setHeroLevel(1);
        } else if (!userData.user.zennUsername) {
          setHeroLevel(1);
        } else {
          const articles = await fetchZennArticles(userData.user.zennUsername, {
            fetchAll: true,
          });
          setHeroLevel(articles.length);
        }
      } catch {
        setHeroLevel(1);
      } finally {
        setIsLoadingTitle(false);
      }
    };
    loadLevel();
  }, []);

  // 勇者のレベルに応じて直近で獲得した称号のIDを取得
  const getLatestTitleId = () => {
    if (isLoadingTitle) return 0;

    // 最終称号（Lv99）の特別処理
    if (heroLevel >= 99) return 11;

    // レベルに応じた称号インデックスを計算（10レベルごとに新しい称号）
    // Math.floor(heroLevel / 10)で10レベルごとのグループを特定
    const titleIndex = Math.min(Math.floor(heroLevel / 10), 9);

    // インデックス → ID（インデックスは0から始まるが、IDは1から始まる）
    return titleIndex + 1;
  };

  // 勇者のレベルに応じて直近で獲得した称号を取得
  const getLatestTitle = () => {
    if (isLoadingTitle) return "";

    // 最終称号（Lv99）の特別処理
    if (heroLevel >= 99) return `${titleNameData[10].name}（Lv99）`;

    // レベルに応じた称号インデックスを計算（10レベルごとに新しい称号）
    const titleIndex = Math.min(Math.floor(heroLevel / 10), 9);

    // インデックス0は初期称号
    if (titleIndex === 0) {
      return `${titleNameData[0].name}（初期称号）`;
    }

    // それ以外はレベル要件と共に表示
    const requiredLevel = titleIndex * 10;
    return `${titleNameData[titleIndex].name}（Lv${requiredLevel}）`;
  };

  // 現在の称号に対応するクラス名を取得
  const getCurrentTitleClass = () => {
    const titleId = getLatestTitleId();

    // ローディング中の場合
    if (titleId === 0) {
      return styles["strength-title-detail-content-loading"];
    }

    // 初期称号の場合
    if (titleId === 1) return styles["strength-title-detail-content-default"];

    // 最終称号（Lv99）の特別処理
    if (titleId === 11) {
      return heroLevel >= 99
        ? styles["strength-title-detail-content-lv99"]
        : styles["strength-title-detail-content-default"];
    }

    // その他の称号の場合はレベルに応じたクラス名を返す
    const requiredLevel = (titleId - 1) * 10;
    return styles[`strength-title-detail-content-lv${requiredLevel}`];
  };

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  return (
    <div className={styles["strength-title-info"]}>
      <div className={styles["strength-title-info-content"]}>
        <div className={styles["strength-title-box"]}>
          <h3 className={styles["strength-title-title"]}>~ 称号 ~</h3>
          <div className={styles["strength-title-detail-bg"]}>
            <div className={styles["strength-title-detail"]}>
              <div
                className={`${
                  styles["strength-title-detail-content"]
                } ${getCurrentTitleClass()}`}
              >
                {isLoadingTitle ? (
                  <div className={styles["loading-indicator"]}>
                    読み込み中...
                  </div>
                ) : (
                  <h4 className={styles["strength-title-detail-text"]}>
                    {getLatestTitle()}
                  </h4>
                )}
              </div>
            </div>
          </div>
          <div className={styles["strength-title-list-link-box"]}>
            <Link
              href="/title"
              className={styles["strength-title-list-link"]}
              onClick={(e) => handleNavigation(e, "/title")}
            >
              称号リストを確認する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthTitleInfo;
