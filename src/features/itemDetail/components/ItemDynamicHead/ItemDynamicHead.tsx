"use client";

import React, { useEffect } from "react";
import { useHero } from "@/contexts/HeroContext";
import {
  isAcquiredByHeroLevel,
  customItemNames,
  customItemDescriptions,
} from "@/features/items/data/itemsData";

interface ItemDynamicHeadProps {
  itemId: number;
}

/**
 * 動的にHeadタグを更新するコンポーネント
 * サーバーサイドで生成されたメタデータの上に、クライアントサイドでレンダリングされる際に
 * 実際の勇者レベルに基づいて適切なタイトルと説明を設定する
 */
const ItemDynamicHead: React.FC<ItemDynamicHeadProps> = ({ itemId }) => {
  const { heroData, isLoading } = useHero();

  useEffect(() => {
    // ロード中は何もしない
    if (isLoading) return;

    // 勇者のレベルに基づいてアイテムの獲得状態を判定
    const isAcquired = isAcquiredByHeroLevel(itemId, heroData.level);

    // ドキュメントのheadタグを取得
    const titleElement = document.querySelector("title");
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const ogDescriptionMeta = document.querySelector(
      'meta[property="og:description"]'
    );

    if (isAcquired) {
      // 獲得済みの場合は、アイテムの名前と説明を表示
      const itemName = customItemNames[itemId];
      const itemDescription = customItemDescriptions[itemId];

      if (titleElement) titleElement.textContent = `${itemName}｜OUTPUT QUEST`;
      if (descriptionMeta)
        descriptionMeta.setAttribute("content", itemDescription);
      if (ogTitleMeta)
        ogTitleMeta.setAttribute("content", `${itemName}｜アイテム詳細`);
      if (ogDescriptionMeta)
        ogDescriptionMeta.setAttribute("content", itemDescription);
    } else {
      // 未獲得の場合は、未獲得のメッセージを表示
      const unacquiredTitle = "未獲得のアイテム";
      const requiredLevelElement = document.querySelector(
        'meta[name="requiredLevel"]'
      );
      const requiredLevel = requiredLevelElement
        ? requiredLevelElement.getAttribute("content")
        : itemId;
      const unacquiredDescription = `このアイテムはレベル${requiredLevel}で獲得できます。冒険を続けて探索しましょう。`;

      if (titleElement)
        titleElement.textContent = `${unacquiredTitle}｜OUTPUT QUEST`;
      if (descriptionMeta)
        descriptionMeta.setAttribute("content", unacquiredDescription);
      if (ogTitleMeta)
        ogTitleMeta.setAttribute("content", `${unacquiredTitle}｜アイテム詳細`);
      if (ogDescriptionMeta)
        ogDescriptionMeta.setAttribute("content", unacquiredDescription);
    }
  }, [itemId, heroData.level, isLoading]);

  return null; // 何もレンダリングしない
};

export default ItemDynamicHead;
