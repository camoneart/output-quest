import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ItemsPage.module.css";
import * as Items from "@/features/items/components/index";

export const metadata: Metadata = getPageMetadata("items");

const ItemsPage = () => {
  return (
    <>
      <h2 className={`${styles["items-title"]}`}>アイテム</h2>
      <div className={`${styles["items-container"]}`}>
        <div className={`${styles["items-header"]}`}>
          <p>獲得したアイテムを確認できます。</p>
          <p>アイテムは最大で30個獲得できます。</p>
          <p>アイテムをクリックすると、アイテムの詳細を確認できます。</p>
        </div>

        <hr className={styles["items-line"]} />

        <Items.ItemCardList />
      </div>
    </>
  );
};

export default ItemsPage;
