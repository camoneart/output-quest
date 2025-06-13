import { Metadata } from "next";
import { baseMetadata } from "@/config/metadata";
import {
  heroLevelAndItemRelation,
  customItemNames,
  customItemDescriptions,
} from "@/features/items/data/itemsData";

/**
 * アイテム詳細ページのメタデータを生成する関数
 * @param itemId アイテムID
 * @returns メタデータオブジェクト
 */
export async function generateItemMetadata(itemId: number): Promise<Metadata> {
  // 無効なIDの場合の処理
  if (isNaN(itemId) || itemId < 1 || itemId > 30) {
    return {
      ...baseMetadata,
      title: "アイテムが見つかりません",
      description: "指定されたアイテムは存在しません。",
    };
  }

  // アイテムのメタデータを生成
  const itemName = customItemNames[itemId];
  const itemDescription = customItemDescriptions[itemId];
  const requiredLevel = heroLevelAndItemRelation[itemId] || itemId;

  // 常に両方のパターンのメタデータを返す
  // クライアントサイドでレンダリング時に適切なデータが表示される
  return {
    ...baseMetadata,
    title: itemName,
    description: itemDescription,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${itemName}｜アイテム詳細`,
      description: itemDescription,
      images: [
        {
          url: `/images/items-page/acquired-icon/item-${itemId}.svg`,
          width: 200,
          height: 200,
          alt: itemName,
        },
      ],
    },
    alternates: {
      canonical: `/items/${itemId}`,
    },
    other: {
      // 未入手の場合のタイトルと説明をカスタムプロパティとして保存
      unacquiredTitle: "未入手のアイテム",
      unacquiredDescription: `このアイテムはレベル${requiredLevel}で入手できます。冒険を続けて探索しましょう。`,
      requiredLevel: `${requiredLevel}`,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://outputquest.com"
    ),
  };
}
