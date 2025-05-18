import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PartyPage.module.css";
import * as Party from "@/features/party/components/index";

export const metadata: Metadata = getPageMetadata("party");

const PartyPage = () => {
  return (
    <>
      <h2 className={`${styles["party-title"]}`}>なかま</h2>
      <div className={`${styles["party-container"]}`}>
        <div className={`${styles["party-header"]}`}>
          <p>獲得したなかまを確認できます。</p>
          <p>なかまは最大で30人獲得できます。</p>
          <p>なかまをクリックすると、なかまの詳細を確認できます。</p>
        </div>

        <hr className={styles["party-line"]} />

        <Party.PartyMemberCardList />
      </div>
    </>
  );
};

export default PartyPage;
