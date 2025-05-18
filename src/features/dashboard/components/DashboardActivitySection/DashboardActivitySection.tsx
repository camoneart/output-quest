"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardActivitySection.module.css";
import Link from "next/link";
import Image from "next/image";
import { fetchZennArticles } from "@/features/posts/services";
import { PostData } from "@/features/posts/types";

// カテゴリー表示用のマッピング
const CATEGORY_DISPLAY = {
  tech: "TECH",
  idea: "IDEA",
};

// プラットフォーム情報
const PLATFORM_INFO = {
  zenn: {
    name: "Zenn",
    favicon: "https://zenn.dev/images/logo-transparent.png",
  },
};

const DashboardActivitySection = () => {
  const [zennArticles, setZennArticles] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
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
        // Zennの記事データを取得
        const articlesData = await fetchZennArticles(username, { limit: 5 });

        setZennArticles(articlesData);
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

    fetchArticles();
  }, []);

  // 日付を表示用にフォーマットする
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <section className={`${styles["recent-activity-section"]}`}>
      <h3 className={`${styles["recent-activity-section-title"]}`}>
        ~ 最近の投稿 ~
      </h3>

      {error && <p className={`${styles["error-message"]}`}>{error}</p>}

      {isLoading ? (
        <ul className={`${styles["recent-activity-list"]}`}>
          <li className={`${styles["recent-activity-item"]}`}>
            <div className={`${styles["recent-activity-item-link"]}`}>
              <div className={`${styles["recent-activity-item-content"]}`}>
                <p className={`${styles["recent-activity-item-title"]}`}>
                  読み込み中...
                </p>
              </div>
              <div className={`${styles["recent-activity-item-exp"]}`}>-</div>
            </div>
          </li>
        </ul>
      ) : zennArticles.length > 0 ? (
        <ul className={`${styles["recent-activity-list"]}`}>
          {zennArticles.map((article) => (
            <li
              key={article.id}
              className={`${styles["recent-activity-item"]}`}
            >
              <Link
                href={article.url}
                className={`${styles["recent-activity-item-link"]}`}
                target="_blank"
              >
                <div className={`${styles["recent-activity-item-content"]}`}>
                  <h4 className={`${styles["recent-activity-item-title"]}`}>
                    {article.title}
                  </h4>

                  <hr />

                  {/* カテゴリーと日付を表示する領域 */}
                  <div className={`${styles["recent-activity-item-info"]}`}>
                    {article.category && (
                      <div
                        className={`${styles["recent-activity-item-category-container"]}`}
                      >
                        <span
                          className={`${styles["recent-activity-item-category"]}`}
                        >
                          {CATEGORY_DISPLAY[
                            article.category as keyof typeof CATEGORY_DISPLAY
                          ] || article.category}
                        </span>
                      </div>
                    )}

                    <div
                      className={`${styles["recent-activity-item-date-container"]}`}
                    >
                      <span
                        className={`${styles["recent-activity-item-date"]}`}
                      >
                        {formatDate(article.publishedAt || article.date)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`${styles["recent-activity-item-platform-container"]}`}
                  >
                    <Image
                      src={PLATFORM_INFO.zenn.favicon}
                      alt="Zenn favicon"
                      width={14}
                      height={14}
                      className={`${styles["recent-activity-item-favicon"]}`}
                    />
                    <p className={`${styles["recent-activity-item-platform"]}`}>
                      {PLATFORM_INFO.zenn.name}
                    </p>
                  </div>
                </div>
                <div className={`${styles["recent-activity-item-exp"]}`}>
                  +1 EXP
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-[25px] pt-[20px]">投稿された記事がありません。</p>
      )}
    </section>
  );
};

export default DashboardActivitySection;
