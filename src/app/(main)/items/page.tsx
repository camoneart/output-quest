import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ItemsPage.module.css";
import * as Items from "@/features/items/components/index";

export const metadata: Metadata = getPageMetadata("items");

const ItemsPage = () => {
  return (
    <>
      <h1 className={`${styles["items-title"]}`}>アイテム</h1>
      <div className={`${styles["items-container"]}`}>
        <div className={`${styles["items-header"]}`}>
          <p>勇者が入手したアイテムを確認できます。</p>
          <p>入手できるアイテムは最大で30個です。</p>
          <p>アイテムをクリックすると、アイテムの詳細を確認できます。</p>
        </div>

        <hr className={styles["items-line"]} />

        <Items.ItemCardList />
      </div>
    </>
  );
};

export default ItemsPage;
