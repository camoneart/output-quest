"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import styles from "./HomeAnimatedCharacter.module.css";
import { homeCharacterImages } from "@/features/home/data/homeCharacterImages";
import { homeCharacterDisplayOrder } from "@/features/home/data/homeCharacterDisplayOrder";

const HomeAnimatedCharacter = ({ delay = 0.5, duration = 15 }) => {
  // 表示順序に基づいて画像データを並び替える
  const orderedCharacters = homeCharacterDisplayOrder
    .map((id) => homeCharacterImages.find((character) => character.id === id))
    .filter((character) => character !== undefined);

  // アニメーションの表示順序を定義（中心から外側へ）
  // [1,2] → [4,3] → [7,9] → [10,8] → [12,11] → [5,6]
  const animationOrder = [
    [1, 2], // 中心の2体（勇者とダークナイト）
    [4, 3], // 第2グループ（アーマー兵士とがいこつ戦士）
    [7, 9], // 第3グループ（魔法使いと悪の魔道士）
    [10, 8], // 第4グループ（弓使いと悪魔）
    [12, 11], // 第5グループ（女騎士と魔王）
    [5, 6], // 第6グループ（大天使と堕天使）
  ];

  // 各キャラクターのアニメーション遅延時間を計算
  const getCharacterDelay = (characterId: number) => {
    for (let groupIndex = 0; groupIndex < animationOrder.length; groupIndex++) {
      if (animationOrder[groupIndex].includes(characterId)) {
        return delay + groupIndex * 0.4; // 0.4秒ずつ遅延を増加
      }
    }
    return delay; // デフォルト値
  };

  return (
    <div className={`${styles["home-character-container"]}`}>
      <ul className={`${styles["home-character-list"]}`}>
        {orderedCharacters.map((character) => {
          // キャラクターごとに遅延を計算
          const characterDelay = getCharacterDelay(character.id);
          // altテキストからクラス名を生成 (例: "Dark Knight" -> "dark-knight")
          // const uniqueClassName = character.alt.toLowerCase().replace(/\s+/g, '-');
          // 新しい className プロパティを使用
          const uniqueClassName = character.className;

          return (
            <motion.li
              key={character.id}
              className={`${styles["home-character-item"]} ${styles[uniqueClassName]}`}
              initial={{ height: 0, overflow: "hidden" }}
              animate={{ height: `100%` }}
              transition={{
                delay: characterDelay,
                duration: duration * 0.5,
                ease: "easeInOut",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: characterDelay + 0.2,
                  duration: duration * 0.4,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={character.src}
                  alt={character.alt}
                  width={character.width}
                  height={character.height}
                  className={`${styles["home-character-image"]}`}
                  style={{
                    width: `${character.width}px`,
                    height: `${character.height}px`,
                  }}
                />
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default HomeAnimatedCharacter;
