"use client";

import React, { useEffect } from "react";
import { useHero } from "@/contexts/HeroContext";
import {
  isAcquiredByHeroLevel,
  customMemberNames,
  customMemberDescriptions,
} from "@/features/party/data/partyMemberData";

interface PartyMemberDynamicHeadProps {
  partyId: number;
}

/**
 * 動的にHeadタグを更新するコンポーネント
 * サーバーサイドで生成されたメタデータの上に、クライアントサイドでレンダリングされる際に
 * 実際の勇者レベルに基づいて適切なタイトルと説明を設定する
 */
const PartyMemberDynamicHead: React.FC<PartyMemberDynamicHeadProps> = ({
  partyId,
}) => {
  const { heroData, isLoading } = useHero();

  useEffect(() => {
    // ロード中は何もしない
    if (isLoading) return;

    // 勇者のレベルに基づいて仲間の獲得状態を判定
    const isAcquired = isAcquiredByHeroLevel(partyId, heroData.level);

    // ドキュメントのheadタグを取得
    const titleElement = document.querySelector("title");
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const ogDescriptionMeta = document.querySelector(
      'meta[property="og:description"]'
    );

    if (isAcquired) {
      // 獲得済みの場合は、仲間の名前と説明を表示
      const memberName = customMemberNames[partyId];
      const memberDescription = customMemberDescriptions[partyId];

      if (titleElement)
        titleElement.textContent = `${memberName}｜OUTPUT QUEST`;
      if (descriptionMeta)
        descriptionMeta.setAttribute("content", memberDescription);
      if (ogTitleMeta)
        ogTitleMeta.setAttribute("content", `${memberName}｜仲間詳細`);
      if (ogDescriptionMeta)
        ogDescriptionMeta.setAttribute("content", memberDescription);
    } else {
      // 未獲得の場合は、未獲得のメッセージを表示
      const unacquiredTitle = "まだ見ぬ仲間";
      const requiredLevelElement = document.querySelector(
        'meta[name="requiredLevel"]'
      );
      const requiredLevel = requiredLevelElement
        ? requiredLevelElement.getAttribute("content")
        : partyId;
      const unacquiredDescription = `このキャラはLv${requiredLevel}で仲間に加わるぞ！冒険を続けて勇者のレベルを上げましょう！`;

      if (titleElement)
        titleElement.textContent = `${unacquiredTitle}｜OUTPUT QUEST`;
      if (descriptionMeta)
        descriptionMeta.setAttribute("content", unacquiredDescription);
      if (ogTitleMeta)
        ogTitleMeta.setAttribute("content", `${unacquiredTitle}｜仲間詳細`);
      if (ogDescriptionMeta)
        ogDescriptionMeta.setAttribute("content", unacquiredDescription);
    }
  }, [partyId, heroData.level, isLoading]);

  return null; // 何もレンダリングしない
};

export default PartyMemberDynamicHead;
