"use client";

import React, { useEffect } from "react";
import styles from "./TitleList.module.css";
import { titleNameData } from "@/shared/data/titleNameDate";
import { useHero } from "@/contexts/HeroContext";

const TitleList = () => {
  // 勇者のレベル情報を取得
  const { heroData, isLoading, refetchHeroData } = useHero();

  // ページアクセス時にheroデータを再取得
  useEffect(() => {
    refetchHeroData();
  }, [refetchHeroData]);
  const heroLevel = isLoading ? 1 : heroData.level;

  // IDに基づいてクラス名を取得する関数
  const getTitleBoxClass = (id: number) => {
    // 初期称号は常に表示
    if (id === 1) return styles["title-page-list-item-box-default"];

    // レベル条件を満たしているか確認（Lv10ごとに新しい称号が解放）
    const requiredLevel = (id - 1) * 10;

    // 最終称号（Lv99）の特別処理
    if (id === 11) {
      return heroLevel >= 99
        ? styles["title-page-list-item-box-lv99"]
        : styles["title-page-list-item-box-Unearned"];
    }

    // レベル条件を満たしていれば対応するスタイル、そうでなければ未獲得スタイル
    return heroLevel >= requiredLevel
      ? styles[`title-page-list-item-box-lv${requiredLevel}`]
      : styles["title-page-list-item-box-Unearned"];
  };

  // 称号名を取得する関数（レベル条件を満たしていない場合は「???」）
  const getTitleName = (title: { id: number; name: string }) => {
    // 初期称号は常に表示
    if (title.id === 1) return `${title.name}（初期称号）`;

    // レベル条件を満たしているか確認
    const requiredLevel = (title.id - 1) * 10;

    // 最終称号（Lv99）の特別処理
    if (title.id === 11) {
      return heroLevel >= 99 ? `${title.name}（Lv99）` : "???（Lv99）";
    }

    // レベル条件を満たしていれば実際の称号名、そうでなければ「???」
    return heroLevel >= requiredLevel
      ? `${title.name}（Lv${requiredLevel}）`
      : `???（Lv${requiredLevel}）`;
  };

  return (
    <ul className={styles["title-page-list"]}>
      {titleNameData.map((title) => (
        <li key={title.id} className={styles["title-page-list-item"]}>
          <div
            className={`${
              styles["title-page-list-item-box"]
            } ${getTitleBoxClass(title.id)}`}
          >
            <h3 className={styles["title-page-list-item-text"]}>
              {getTitleName(title)}
            </h3>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TitleList;
