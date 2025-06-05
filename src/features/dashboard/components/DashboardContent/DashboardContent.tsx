"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardContent.module.css";
import * as Dashboard from "@/features/dashboard/components";
import { useHero } from "@/contexts/HeroContext";
import { heroLevelAndItemRelation } from "@/features/items/data/itemsData";

const DashboardContent = () => {
  const { heroData, isLoading: isHeroLoading, refetchHeroData } = useHero();
  const [lastAcquiredItemId, setLastAcquiredItemId] = useState<number | null>(
    null
  );

  // ページアクセス時にheroデータを再取得
  useEffect(() => {
    refetchHeroData();
  }, [refetchHeroData]);

  useEffect(() => {
    if (!isHeroLoading) {
      // isLoading が false になったら処理開始
      // 現在のレベルで獲得済みのアイテムIDリストを取得
      const acquiredItemIds = Object.entries(heroLevelAndItemRelation)
        // 現在のレベルが必要レベル以上であるアイテムをフィルタリング
        .filter(([, requiredLevel]) => heroData.level >= requiredLevel)
        // キー（アイテムID文字列）を数値に変換して配列にする
        .map(([itemIdStr]) => parseInt(itemIdStr, 10));

      // 獲得済みのアイテムが存在する場合
      if (acquiredItemIds.length > 0) {
        // 獲得済みのアイテムIDの中で最大のものを「最後に獲得したアイテム」とする
        const latestId = Math.max(...acquiredItemIds);
        setLastAcquiredItemId(latestId);
      } else {
        // 獲得済みのアイテムがない場合（レベルが低いなど）
        setLastAcquiredItemId(null);
      }
    }
    // heroData.level または isHeroLoading が変更されたときに再実行
  }, [heroData.level, isHeroLoading]);

  // ダミーデータ (必要に応じて調整)
  const dummyDashboardData = {
    heroData: heroData,
    postStats: [{ platform: "Zenn", count: 0, color: "#3ea8ff" }],
    recentActivity: [],
    lastItem: { id: lastAcquiredItemId || 0, name: "" },
  };

  return (
    <div className={`${styles["dashboard-content-container"]}`}>
      <Dashboard.DashboardHeroSection dashboardData={dummyDashboardData} />

      <hr />

      <div className={styles["dashboard-zenn-area"]}>
        <Dashboard.DashboardPlatformStatsSection
          dashboardData={dummyDashboardData}
        />

        <hr className="block md:hidden" />

        <Dashboard.DashboardActivitySection />
      </div>

      {!isHeroLoading && (
        <>
          <hr />
          <Dashboard.DashboardLatestPartyMemberSection />
        </>
      )}

      {!isHeroLoading && (
        <>
          <hr />
          <Dashboard.DashboardLatestItemSection />
        </>
      )}
    </div>
  );
};

export default DashboardContent;
