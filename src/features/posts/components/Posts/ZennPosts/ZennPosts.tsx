"use client";

import React, { useState, useEffect } from "react";
import * as Posts from "@/features/posts/components/index";
import styles from "./ZennPosts.module.css";
import { fetchZennArticles } from "@/features/posts/services";
import { PostData, PlatformType } from "@/features/posts/types";

// フォールバック用のダミーデータ
const dummyZennPosts: PostData[] = [];

const ZennPosts = () => {
  const [posts, setPosts] = useState<PostData[]>(dummyZennPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getZennPosts = async () => {
      try {
        setLoading(true);
        // ユーザー情報を取得
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
        const articlesData = await fetchZennArticles(username, {
          fetchAll: true,
        });
        if (articlesData.length > 0) {
          // 各記事に platformType: "zenn" を設定
          const processedArticles = articlesData.map((article) => ({
            ...article,
            platformType: "zenn" as PlatformType,
          }));
          setPosts(processedArticles);
        }
      } catch (err) {
        console.error("Zenn記事の取得エラー:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Zennの記事データの取得中にエラーが発生しました。"
        );
      } finally {
        setLoading(false);
      }
    };
    getZennPosts();
  }, []);

  return (
    <div className={styles["posts-container"]}>
      <div className={styles["platform-title-box"]}>
        <h3 className={styles["platform-title"]}>Zennの投稿一覧</h3>
      </div>
      <hr className={styles["posts-container-line"]} />

      {error ? (
        <div className={styles["error-message"]}>{error}</div>
      ) : loading ? (
        <div className={styles["loading-indicator"]}>読み込み中...</div>
      ) : (
        <Posts.PostsList postsData={posts} />
      )}
    </div>
  );
};

export default ZennPosts;
