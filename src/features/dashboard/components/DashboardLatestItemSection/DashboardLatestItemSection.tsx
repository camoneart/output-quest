"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardLatestItemSection.module.css";
import Link from "next/link";
import Image from "next/image";
import {
  heroLevelAndItemRelation,
  customItemNames,
  customItemDescriptions,
} from "@/features/items/data/itemsData";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { useRouter } from "next/navigation";
import { fetchZennArticles } from "@/features/posts/services";

const DashboardLatestItemSection: React.FC = () => {
  const [itemId, setItemId] = useState<number | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState<boolean>(true);
  const [itemError, setItemError] = useState<string | null>(null);
  const router = useRouter();

  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoadingItem(true);
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        if (!userData.success) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const username = userData.user.zennUsername;
        if (!username) {
          throw new Error("Zennアカウントが連携されていません");
        }
        // 最新のZenn記事数を取得
        const articles = await fetchZennArticles(username, { fetchAll: true });
        const articleCount = articles.length;
        const acquiredIds = Object.entries(heroLevelAndItemRelation)
          .filter(([, reqLevel]) => articleCount >= reqLevel)
          .map(([id]) => parseInt(id, 10));
        if (acquiredIds.length > 0) {
          setItemId(Math.max(...acquiredIds));
        } else {
          setItemId(null);
        }
      } catch (err) {
        console.error("アイテム取得エラー:", err);
        setItemError(
          err instanceof Error
            ? err.message
            : "アイテムデータの取得に失敗しました。"
        );
      } finally {
        setIsLoadingItem(false);
      }
    };
    fetchItem();
  }, []);

  if (isLoadingItem || itemError) {
    return null;
  }

  const itemName =
    itemId !== null ? customItemNames[itemId] || "不明なアイテム" : "";
  const itemDescription =
    itemId !== null ? customItemDescriptions[itemId] || "詳細不明" : "";

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  return (
    <section className={`${styles["last-item-section"]}`}>
      <h3 className={`${styles["last-item-title"]}`}>
        ~ 最近獲得したアイテム ~
      </h3>
      <div className={`${styles["last-item-container"]}`}>
        {itemId === null ? (
          <p>まだ獲得したアイテムはありません。</p>
        ) : (
          <div className={`${styles["last-item-box"]}`}>
            <Link
              href={`/items/${itemId}`}
              className={`${styles["last-item-link"]}`}
              onClick={(e) => handleNavigation(e, `/items/${itemId}`)}
            >
              <div className={`${styles["last-item-icon-container"]}`}>
                <div className={`${styles["last-item-icon-box"]}`}>
                  <Image
                    src={`/images/items-page/acquired-icon/item-${itemId}.svg`}
                    alt={itemName}
                    width={35}
                    height={35}
                    className={`${styles["last-item-icon"]}`}
                  />
                </div>
              </div>
              <div className={`${styles["last-item-info"]}`}>
                <p className={`${styles["last-item-name"]}`}>{itemName}</p>
                <p className={`${styles["last-item-description"]}`}>
                  {itemDescription}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardLatestItemSection;
