import { ReactNode } from "react";
import { itemsData } from "@/features/items/data/itemsData";

// アイテムデータの型定義
export interface ItemData {
  id: number;
  name: string;
  description: string;
  rarity: ReactNode;
  rarityType: "normal" | "rare" | "superRare";
}

// アイテムデータを生成する関数
export const generateItemData = (
  itemId: number,
  isAcquired: boolean,
  rarityComponents: { normal: ReactNode; rare: ReactNode; superRare: ReactNode }
): ItemData | null => {
  if (!isAcquired) {
    return null;
  }

  // モックデータからアイテム名と説明文を取得
  const item = itemsData.items.find((item) => item.id === itemId);
  const itemName = item && item.name ? item.name : `アイテム${itemId}`;
  const itemDescription =
    item && item.description
      ? item.description
      : `これは${itemName}の説明です。このアイテムは様々な効果を持っています。`;

  return {
    id: itemId,
    name: itemName,
    description: itemDescription,
    rarity:
      itemId === 30
        ? rarityComponents.superRare
        : itemId > 12
        ? rarityComponents.rare
        : rarityComponents.normal,
    rarityType: itemId === 30 ? "superRare" : itemId > 12 ? "rare" : "normal",
  };
};
