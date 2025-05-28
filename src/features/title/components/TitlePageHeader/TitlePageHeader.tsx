"use client";

import React, { useEffect } from "react";
import styles from "./TitlePageHeader.module.css";
import { useHero } from "@/contexts/HeroContext";

const TitlePageHeader = () => {
  // 勇者のレベル情報を取得
  const { heroData, isLoading, refetchHeroData } = useHero();

  // ページアクセス時にheroデータを再取得
  useEffect(() => {
    refetchHeroData();
  }, [refetchHeroData]);
  const heroLevel = isLoading ? 1 : heroData.level;

  // 次の称号の解放に必要なレベル
  const nextTitleRequiredLevel =
    heroLevel < 10 ? 10 : Math.ceil(heroLevel / 10) * 10;

  // 次の称号獲得までに必要な残りレベル数
  const remainingLevels = isLoading ? (
    <div className={styles["loading-indicator"]}>...</div>
  ) : (
    nextTitleRequiredLevel - heroLevel
  );

  // レベル99到達後は、次の称号獲得までのレベルは表示しない
  const isNextTitleAvailable = heroLevel < 99;

  return (
    <div className={styles["title-page-header"]}>
      <p className={styles["title-page-header-text"]}>
        このページでは、「獲得した称号」と「未獲得の称号」を一覧で確認できます。
      </p>
      <p className={styles["title-page-header-text"]}>
        称号は勇者のレベルに応じて獲得できます。
      </p>
      <div className={styles["title-page-header-text-box"]}>
        <div className={styles["title-page-header-level-info"]}>
          <span className={styles["title-page-header-level-info-title"]}>
            - 現在のレベル -
          </span>
          <div className={styles["title-page-header-level-value"]}>
            <span className={styles["title-page-header-level-value-text"]}>
              Lv
            </span>
            <span className={styles["title-page-header-level-value-number"]}>
              {isLoading ? (
                <div className={styles["loading-indicator"]}>...</div>
              ) : (
                heroData.level
              )}
            </span>
          </div>
        </div>
        {isNextTitleAvailable && (
          <div className={styles["title-page-header-next-title"]}>
            <span className={styles["title-page-header-next-title-text"]}>
              - 次の称号獲得まで -
            </span>
            <div className={styles["title-page-header-next-title-value"]}>
              <span
                className={styles["title-page-header-next-title-value-text"]}
              >
                Lv
              </span>
              <span
                className={styles["title-page-header-next-title-value-number"]}
              >
                {remainingLevels}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitlePageHeader;
