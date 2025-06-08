import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import styles from "./ItemDetailPage.module.css";
import * as itemDetail from "@/features/itemDetail/components/index";
import { generateItemMetadata } from "@/features/itemDetail/metadata/generateItemMetadata";

export async function generateMetadata(
  { params }: { params: Promise<{ itemId: string }> }
): Promise<Metadata> {
  const { itemId } = await params;
  const itemIdNum = parseInt(itemId);
  return generateItemMetadata(itemIdNum);
}

export default async function ItemDetailPage(
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const itemIdNum = parseInt(itemId);

  if (isNaN(itemIdNum) || itemIdNum < 1 || itemIdNum > 30) {
    notFound();
  }

  return (
    <>
      {/* 動的にHeadを更新するコンポーネント */}
      <itemDetail.ItemDynamicHead itemId={itemIdNum} />

      <h1 className={styles["item-detail-page-title"]}>アイテム詳細</h1>
      <div className={styles["item-detail-container"]}>
        {/* クライアントコンポーネントとしてItemDetailClientを使用 */}
        <itemDetail.ItemDetailClient itemId={itemIdNum} />

        <hr />

        <itemDetail.ItemDetailFooter />
      </div>
    </>
  );
}
