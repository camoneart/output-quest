import React from "react";
import Image from "next/image";
import styles from "./PartyMemberRarityStar.module.css";

// 星のコンポーネント
const PartyMemberRarityStar = () => (
  <Image
    src="/images/icon/star_yellow.svg"
    alt="★"
    width={17}
    height={17}
    className={styles["rarity-star-icon"]}
  />
);

// 通常レア度（星1つ）
export const NormalRarity = () => (
  <div className={styles["rarity-star-container"]}>
    <PartyMemberRarityStar />
  </div>
);

// レア（星2つ）
export const RareRarity = () => (
  <div className={styles["rarity-star-container"]}>
    <PartyMemberRarityStar />
    <PartyMemberRarityStar />
  </div>
);

// 超レア（星3つ）
export const SuperRareRarity = () => (
  <div className={styles["rarity-star-container"]}>
    <PartyMemberRarityStar />
    <PartyMemberRarityStar />
    <PartyMemberRarityStar />
  </div>
);

// レア度コンポーネントをオブジェクトとしてエクスポート
const rarity = {
  normal: <NormalRarity />,
  rare: <RareRarity />,
  superRare: <SuperRareRarity />,
};

export default rarity;
