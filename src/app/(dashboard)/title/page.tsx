import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./TitlePage.module.css";
import * as Title from "@/features/title/components/index";

export const metadata: Metadata = getPageMetadata("title");

const TitlePage = () => {
  return (
    <>
      <h2 className={`${styles["title-page-title"]}`}>称号リスト</h2>
      <div className={`${styles["title-page-container"]}`}>
        <Title.TitlePageHeader />

        <hr className={styles["title-page-line-first"]} />

        {/* クライアントコンポーネントで称号リストを表示 */}
        <Title.TitleList />

        <hr className={styles["title-page-line-second"]} />

        <Title.TitlePageFooter />
      </div>
    </>
  );
};

export default TitlePage;
