"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./PartyMemberDetail.module.css";
import * as PartyMember from "@/features/partyMember/components/index";
import {
  heroLevelAndMemberRelation,
  isAcquiredByHeroLevel,
  customMemberNames,
  customMemberDescriptions,
} from "@/features/party/data/partyMemberData";
import { fetchZennArticles } from "@/features/posts/services";

interface PartyMemberDetailProps {
  partyId: number;
}

// レア度を判定する関数
const getMemberRarityType = (
  partyId: number
): "normal" | "rare" | "superRare" => {
  if (partyId === 30) return "superRare";
  if (partyId > 12) return "rare";
  return "normal";
};

const PartyMemberDetail: React.FC<PartyMemberDetailProps> = ({ partyId }) => {
  // Zenn連携アカウントのレベル取得状態
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState<boolean>(true);
  const [levelError, setLevelError] = useState<string | null>(null);

  useEffect(() => {
    const loadLevel = async () => {
      try {
        setIsLoadingLevel(true);
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        if (!userData.success) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const username = userData.user.zennUsername;
        if (!username) {
          setCurrentLevel(1);
          return;
        }
        const articles = await fetchZennArticles(username, { fetchAll: true });
        setCurrentLevel(articles.length);
      } catch (err) {
        console.error("レベル取得エラー:", err);
        setLevelError(
          err instanceof Error
            ? err.message
            : "レベル取得中にエラーが発生しました。"
        );
      } finally {
        setIsLoadingLevel(false);
      }
    };
    loadLevel();
  }, []);

  if (levelError) {
    return <p className={styles["error-text"]}>{levelError}</p>;
  }

  // 現在のレベルに基づいて獲得状態を動的に判定
  const isAcquired = isAcquiredByHeroLevel(partyId, currentLevel);

  // なかまを獲得するために必要なレベル
  const requiredLevel = heroLevelAndMemberRelation[partyId] || partyId;

  // レベル差を計算（マイナスにならないようにする）
  const levelDifference = Math.max(0, requiredLevel - currentLevel);

  // なかまの名前と説明文を取得
  const memberName = isAcquired
    ? customMemberNames[partyId] || `パーティメンバー${partyId}`
    : null;
  const memberDescription = isAcquired
    ? customMemberDescriptions[partyId] || `これは${memberName}の説明です。`
    : null;

  // レア度を取得
  const rarityType = getMemberRarityType(partyId);

  return (
    <div className={styles["party-member-content"]}>
      <div className={styles["party-member-card"]}>
        <div className={styles["party-member-card-content"]}>
          <div className={styles["party-member-image-box"]}>
            {isLoadingLevel ? (
              <div className={styles["loading-indicator"]}>読み込み中...</div>
            ) : isAcquired ? (
              <Image
                src={`/images/party-page/acquired-icon/party-member-${partyId}.svg`}
                alt={memberName || "パーティメンバー"}
                width={60}
                height={60}
                priority={true}
                className={`${styles["party-member-image"]} ${
                  styles[`party-member-image-${partyId}`]
                }`}
              />
            ) : (
              <div className={styles["party-member-unknown-icon"]}>
                <Image
                  src="/images/party-page/unacquired-icon/mark_question.svg"
                  alt="未獲得のパーティメンバー"
                  width={60}
                  height={60}
                  priority={true}
                  className={styles["party-member-unknown-image"]}
                />
              </div>
            )}
          </div>

          <div className={styles["party-member-title-box"]}>
            <h2 className={styles["party-member-title"]}>
              {isLoadingLevel ? (
                <div className={styles["loading-indicator"]}>読み込み中...</div>
              ) : isAcquired ? (
                memberName
              ) : (
                "未獲得のなかま"
              )}
            </h2>
          </div>

          {isLoadingLevel ? null : isAcquired ? (
            <>
              <div className={styles["party-member-description-box"]}>
                <p className={styles["party-member-description"]}>
                  {memberDescription}
                </p>
              </div>

              <div className={styles["party-member-rarity-box"]}>
                <h3 className={styles["party-member-rarity-title"]}>レア度</h3>
                <div className={styles["party-member-rarity-stars"]}>
                  {rarityType === "normal" &&
                    PartyMember.PartyMemberRarityStar.normal}
                  {rarityType === "rare" &&
                    PartyMember.PartyMemberRarityStar.rare}
                  {rarityType === "superRare" &&
                    PartyMember.PartyMemberRarityStar.superRare}
                </div>
              </div>
            </>
          ) : (
            <div className={styles["party-member-locked-message-box"]}>
              <p className={styles["party-member-locked-message-text"]}>
                このなかまは、Lv{requiredLevel}で獲得できるぞ！
              </p>
              <p className={styles["party-member-locked-message-text"]}>
                Lv{requiredLevel}まで、あと{levelDifference}レベル
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyMemberDetail;
