"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { fetchZennArticles } from "@/features/posts/services";
import { HeroData } from "@/types/hero.types";
import { strengthHeroData } from "@/features/strength/data/strengthHeroData";

// Contextの型定義
type HeroContextType = {
  heroData: HeroData;
  isLoading: boolean;
  error: string | null;
};

// Contextの作成
const HeroContext = createContext<HeroContextType | undefined>(undefined);

// Providerコンポーネント
export const HeroProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [heroData, setHeroData] = useState<HeroData>({
    ...strengthHeroData,
    level: 1, // 初期値は1に設定
  });
  const [isLoading, setIsLoading] = useState(true);
  // `setError` is unused for now, keep the state read‑only
  const [error] = useState<string | null>(null);

  // 記事データを取得してレベルを設定
  useEffect(() => {
    const getZennArticlesCount = async (retryCount = 0) => {
      if (!isLoaded) {
        setIsLoading(true);
        return;
      }
      if (isLoaded && !user) {
        setHeroData({ ...strengthHeroData, level: 1 });
        setIsLoading(false);
        return;
      }

      if (isLoaded && user) {
        setIsLoading(true);
        try {
          console.log(
            `HeroContext: /api/user 呼び出し開始 (試行: ${retryCount + 1})`
          );
          const userRes = await fetch("/api/user");
          const userData = await userRes.json();

          if (userRes.ok && userData.success && userData.user.zennUsername) {
            const username = userData.user.zennUsername;
            await fetch(`/api/zenn?username=${username}&updateUser=true`);
            const articles = await fetchZennArticles(username, {
              fetchAll: true,
            });
            const articlesCount = articles.length;
            const calculatedLevel = articlesCount;
            setHeroData({
              ...strengthHeroData,
              level: calculatedLevel,
              currentExp: 40,
              nextLevelExp: 100,
              remainingArticles: 1,
            });
            setIsLoading(false);
          } else if (
            userRes.ok &&
            userData.success &&
            !userData.user.zennUsername
          ) {
            setHeroData({ ...strengthHeroData, level: 1 });
            setIsLoading(false);
          } else {
            console.log(
              `HeroContext: /api/user 呼び出し失敗 (ステータス: ${
                userRes.status
              }, 試行: ${retryCount + 1})`
            );
            if (userRes.status === 404 && retryCount < 2) {
              console.log(`HeroContext: 2秒後にリトライします...`);
              setTimeout(() => getZennArticlesCount(retryCount + 1), 2000);
            } else {
              setHeroData({ ...strengthHeroData, level: 1 });
              setIsLoading(false);
            }
          }
        } catch (err) {
          console.error(
            `HeroContext: API呼び出しエラー (試行: ${retryCount + 1}):`,
            err
          );
          setHeroData({ ...strengthHeroData, level: 1 });
          setIsLoading(false);
        }
      }
    };
    getZennArticlesCount();
  }, [isLoaded, user]);

  return (
    <HeroContext.Provider
      value={{
        heroData,
        isLoading,
        error,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
};

// カスタムフック
export const useHero = () => {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
};
