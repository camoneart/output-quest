"use client";

import React, { useState, useEffect } from "react";
import styles from "./EquipmentDetailPage.module.css";
import { useEquipment } from "@/features/equipment/contexts/EquipmentContext";
import { Item } from "@/features/items/types/items.types";
import { updateItemsByLevel } from "@/features/items/data/itemsData";
import { fetchZennArticles } from "@/features/posts/services";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

interface EquipmentDetailPageClientProps {
  equipmentSlug: string;
}

// クライアントコンポーネント
const EquipmentDetailPageClient = ({
  equipmentSlug,
}: EquipmentDetailPageClientProps) => {
  const { equipmentState, equipItem, unequipItem } = useEquipment();

  const router = useRouter();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  const getEquipmentName = (id: string) => {
    switch (id) {
      case "weapon":
        return "武器";
      case "shield":
        return "盾";
      case "helmet":
        return "かぶと";
      case "armor":
        return "よろい";
      case "accessory":
        return "アクセサリー";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoadingItems(true);
        // ユーザー情報取得
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        if (!userData.success) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const username = userData.user.zennUsername;
        if (!username) {
          setItems([]);
        } else {
          // Zenn記事数取得
          const articles = await fetchZennArticles(username, {
            fetchAll: true,
          });
          const level = articles.length;
          const allItems = updateItemsByLevel(level);
          setItems(allItems);
        }
      } catch (err) {
        console.error("アイテム取得エラー:", err);
        setItemsError(
          err instanceof Error
            ? err.message
            : "アイテムデータ取得中にエラーが発生しました。"
        );
      } finally {
        setIsLoadingItems(false);
      }
    };
    fetchItems();
  }, [equipmentSlug]);

  // 装備品一覧エリア
  const filteredItems = items.filter(
    (item) => item.acquired && item.type === equipmentSlug
  );

  const handleNavigationEquip = (item: Item) => {
    playClickSound(() => {
      equipItem({ id: item.id, name: item.name as string, type: item.type });
      router.push("/strength");
    });
  };
  const handleUnequipItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    unequipItem(equipmentSlug as keyof typeof equipmentState);
  };

  return (
    <>
      <h2 className={`${styles["equipment-detail-title"]}`}>
        そうび一覧（{getEquipmentName(equipmentSlug)}）
      </h2>
      <div className={`${styles["equipment-detail-container"]}`}>
        {/* 装備情報エリア */}
        <div className={`${styles["equipment-current-item"]}`}>
          <div className={styles["equipment-current-item-box"]}>
            <div className={styles["equipment-current-item-content"]}>
              <h3 className={`${styles["equipment-current-item-title"]}`}>
                現在の装備：
                {isLoadingItems
                  ? "ーーー"
                  : equipmentState[equipmentSlug as keyof typeof equipmentState]
                  ? equipmentState[equipmentSlug as keyof typeof equipmentState]
                      ?.name
                  : "そうびなし"}
              </h3>
              {equipmentState[equipmentSlug as keyof typeof equipmentState] && (
                <button
                  className={`${styles["unequip-button"]}`}
                  onClick={(e) => {
                    handleUnequipItem(e);
                    playClickSound(() => router.push("/strength"));
                  }}
                >
                  <span className={`${styles["unequip-button-text"]}`}>
                    はずす
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <hr className={`${styles["equipment-detail-line"]}`} />

        {/* 装備品一覧エリア */}
        {isLoadingItems ? (
          <div className={styles["equipment-detail-loading"]}>
            読み込み中...
          </div>
        ) : itemsError ? (
          <div className={styles["equipment-detail-no-item-text"]}>
            {itemsError}
          </div>
        ) : filteredItems.length > 0 ? (
          <ul className={styles["equipment-detail-list"]}>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={`${styles["equipment-detail-item"]} ${
                  equipmentState[equipmentSlug as keyof typeof equipmentState]
                    ?.id === item.id
                    ? styles["equipment-detail-item-equipped"]
                    : ""
                }`}
                onClick={() =>
                  equipmentState[equipmentSlug as keyof typeof equipmentState]
                    ?.id === item.id
                    ? undefined
                    : handleNavigationEquip(item)
                }
              >
                <div className={styles["equipment-detail-item-content"]}>
                  <div className={styles["equipment-detail-item-icon"]}>
                    <Image
                      src={`/images/items-page/acquired-icon/item-${item.id}.svg`}
                      alt={item.name || "アイテム"}
                      width={50}
                      height={50}
                      className={styles["equipment-detail-item-icon-image"]}
                    />
                  </div>
                  <h3 className={styles["equipment-detail-item-name"]}>
                    {item.name}{" "}
                    {equipmentState[
                      equipmentSlug as keyof typeof equipmentState
                    ]?.id === item.id && "（装備中）"}
                  </h3>
                  {item.description && (
                    <div
                      className={styles["equipment-detail-item-description"]}
                    >
                      <p
                        className={
                          styles["equipment-detail-item-description-text"]
                        }
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles["equipment-detail-no-item"]}>
            <p className={styles["equipment-detail-no-item-text"]}>
              装備品がありません
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default EquipmentDetailPageClient;
