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

    // 勇者のレベルに基づいてなかまの獲得状態を判定
    const isAcquired = isAcquiredByHeroLevel(partyId, heroData.level);

    // ドキュメントのheadタグを取得
    const titleElement = document.querySelector("title");
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const ogDescriptionMeta = document.querySelector(
      'meta[property="og:description"]'
    );

    if (isAcquired) {
      // 獲得済みの場合は、なかまの名前と説明を表示
      const memberName = customMemberNames[partyId];
      const memberDescription = customMemberDescriptions[partyId];

      if (titleElement)
        titleElement.textContent = `${memberName}｜OUTPUT QUEST`;
      if (descriptionMeta)
        descriptionMeta.setAttribute("content", memberDescription);
      if (ogTitleMeta)
        ogTitleMeta.setAttribute("content", `${memberName}｜なかま詳細`);
      if (ogDescriptionMeta)
        ogDescriptionMeta.setAttribute("content", memberDescription);
    } else {
      // 未獲得の場合は、未獲得のメッセージを表示
      const unacquiredTitle = "未獲得のなかま";
      const requiredLevelElement = document.querySelector(
        'meta[name="requiredLevel"]'
      );
      const requiredLevel = requiredLevelElement
        ? requiredLevelElement.getAttribute("content")
        : partyId;
      const unacquiredDescription = `このなかまはレベル${requiredLevel}で獲得できます。冒険を続けて探索しましょう。`;

      if (titleElement)
        titleElement.textContent = `${unacquiredTitle}｜OUTPUT QUEST`;
      if (descriptionMeta)
        descriptionMeta.setAttribute("content", unacquiredDescription);
      if (ogTitleMeta)
        ogTitleMeta.setAttribute("content", `${unacquiredTitle}｜なかま詳細`);
      if (ogDescriptionMeta)
        ogDescriptionMeta.setAttribute("content", unacquiredDescription);
    }
  }, [partyId, heroData.level, isLoading]);

  return null; // 何もレンダリングしない
};

export default PartyMemberDynamicHead;
