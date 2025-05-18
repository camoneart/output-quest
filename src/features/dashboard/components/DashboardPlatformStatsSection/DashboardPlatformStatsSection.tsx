"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardPlatformStatsSection.module.css";
import { DashboardData } from "../../types/dashboard.types";
import { fetchZennArticles } from "@/features/posts/services";

type DashboardPlatformStatsSectionProps = {
  dashboardData: DashboardData;
};

const DashboardPlatformStatsSection = ({
  dashboardData,
}: DashboardPlatformStatsSectionProps) => {
  const [zennArticleCount, setZennArticleCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZennData = async () => {
      try {
        setIsLoading(true);
        // 連携済みユーザー情報を取得
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        if (!userData.success) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const username = userData.user.zennUsername;
        if (!username) {
          throw new Error("Zennアカウントが連携されていません");
        }
        // 記事データを取得
        const articlesData = await fetchZennArticles(username, { limit: 100 });

        // 記事数を設定
        setZennArticleCount(articlesData.length);
      } catch (err) {
        console.error("Zenn記事の取得エラー:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Zennの記事データの取得中にエラーが発生しました。"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchZennData();
  }, []);

  // 実際のZennデータとモックデータを組み合わせてstatsを作成
  const zennStat = {
    platform: "Zenn",
    count: isLoading ? dashboardData.postStats[0].count : zennArticleCount,
    color: "#3ea8ff",
  };

  return (
    <section className={`${styles["platform-stats-section"]}`}>
      <h3 className={`${styles["platform-stats-title"]}`}>~ 投稿状況 ~</h3>
      <div className={`${styles["platform-stats-container"]}`}>
        <div className={`${styles["platform-stats-grid"]}`}>
          <div
            className={`${styles["platform-stat-card"]} ${styles["platform-stat-card-zenn"]}`}
          >
            <div className={`${styles["platform-stat-card-content"]}`}>
              <h4 className={`${styles["platform-stat-card-title"]}`}>
                {zennStat.platform}
              </h4>
              <div className={`${styles["platform-stat-count"]}`}>
                {isLoading ? (
                  <span className={`${styles["platform-stat-loading"]}`}>
                    読み込み中...
                  </span>
                ) : error ? (
                  <span className={`${styles["platform-stat-error"]}`}>
                    ...
                  </span>
                ) : (
                  <>
                    <em className={`${styles["platform-stat-count-em"]}`}>
                      {zennStat.count}
                    </em>
                    <span className={`${styles["platform-stat-unit"]}`}>
                      記事
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPlatformStatsSection;
