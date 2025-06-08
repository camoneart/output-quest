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
import { useHero } from "@/contexts/HeroContext";

const DashboardLatestItemSection: React.FC = () => {
  const [itemId, setItemId] = useState<number | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState<boolean>(true);
  const { heroData, isLoading: isHeroLoading, error } = useHero();
  const router = useRouter();

  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190,
  });

  useEffect(() => {
    const calculateItem = () => {
      // HeroContextがまだ読み込み中の場合は待機
      if (isHeroLoading) {
        return;
      }

      try {
        setIsLoadingItem(true);

        // HeroContextから記事数（レベル）を取得
        const articleCount = heroData.level;

        const acquiredIds = Object.entries(heroLevelAndItemRelation)
          .filter(([, reqLevel]) => articleCount >= reqLevel)
          .map(([id]) => parseInt(id, 10));

        if (acquiredIds.length > 0) {
          setItemId(Math.max(...acquiredIds));
        } else {
          setItemId(null);
        }
      } catch (err) {
        console.error("アイテム計算エラー:", err);
      } finally {
        setIsLoadingItem(false);
      }
    };

    calculateItem();
  }, [isHeroLoading, heroData.level]); // HeroContextの状態に依存

  // 読み込み状態またはエラー時は何も表示しない
  if (isHeroLoading || isLoadingItem || error) {
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
      <h2 className={`${styles["last-item-title"]}`}>
        ~ 最近獲得したアイテム ~
      </h2>
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
                <h3 className={`${styles["last-item-name"]}`}>{itemName}</h3>
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
