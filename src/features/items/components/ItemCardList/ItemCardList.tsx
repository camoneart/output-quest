"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ItemCardList.module.css";
import * as Items from "@/features/items/components/index";
import { updateItemsByLevel } from "@/features/items/data/itemsData";
import { fetchZennArticles } from "@/features/posts/services";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { Item } from "@/features/items/types/items.types";

const ItemCardList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190,
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        if (!userData.success) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const username = userData.user.zennUsername;
        if (!username) {
          throw new Error("Zennアカウントが連携されていません");
        }
        const articles = await fetchZennArticles(username, { fetchAll: true });
        const articleCount = articles.length;
        const updatedItems = updateItemsByLevel(articleCount);
        setItems(updatedItems);
      } catch (err) {
        console.error("アイテムデータ取得エラー:", err);
        setError(
          err instanceof Error
            ? err.message
            : "アイテムデータの取得に失敗しました。"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  if (isLoading) {
    return (
      <div className={styles["items-loading-indicator"]}>読み込み中...</div>
    );
  }
  if (error) {
    return <p className={styles["error-message"]}>{error}</p>;
  }

  return (
    <div className={styles["items-grid"]}>
      {items.map((item) => (
        <div className={`${styles["item-card-content"]}`} key={item.id}>
          <Link
            href={`/items/${item.id}`}
            className={styles["item-card"]}
            onClick={(e) => handleNavigation(e, `/items/${item.id}`)}
          >
            {item.acquired ? (
              <div className={styles["acquired-item-icon"]}>
                <Image
                  src={`/images/items-page/acquired-icon/item-${item.id}.svg`}
                  alt={item.name || "アイテム"}
                  width={40}
                  height={40}
                  className={`${styles["acquired-item-icon-image"]} ${
                    styles[`acquired-item-icon-image-${item.id}`]
                  }`}
                />
              </div>
            ) : (
              <div className={styles["unacquired-item-icon"]}>
                <Items.TreasureChestIcon
                  width={40}
                  height={40}
                  className={styles["unacquired-item-icon-image"]}
                />
              </div>
            )}
            <p className={styles["item-name"]}>
              {item.acquired ? item.name : "???"}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ItemCardList;
