import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./StrengthPage.module.css";
import * as Strength from "@/features/strength/components/index";

export const metadata: Metadata = getPageMetadata("strength");

const StrengthPage = () => {
  return (
    <>
      <h1 className={`${styles["strength-title"]}`}>つよさ</h1>
      <div className={`${styles["strength-container"]}`}>
        <div className={styles["strength-content"]}>
          {/* （左上）勇者のコンテンツ */}
          <Strength.StrengthHeroInfo />
          {/* （右上）称号 */}
          <Strength.StrengthTitleInfo />
          {/* （左下）装備アイテムリスト */}
          <Strength.StrengthEquipmentInfo />
          {/* （右下）冒険ログ */}
          <Strength.StrengthLogInfo />
        </div>
      </div>
    </>
  );
};

export default StrengthPage;
