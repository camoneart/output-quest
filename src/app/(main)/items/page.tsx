import { Suspense } from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ItemsPage.module.css";
import ItemCardList from "@/features/items/components/item-card-list/ItemCardList";
import ItemListSkeleton from "@/features/items/components/item-list-skeleton/ItemListSkeleton";

export const metadata: Metadata = getPageMetadata("items");

const ItemsPage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["items-title"]}`}>アイテム</h1>
			<div className={`${styles["items-container"]}`}>
				<div className={`${styles["items-header"]}`}>
					<p>勇者が入手したアイテムを確認できます。</p>
					<p>入手できるアイテムは最大で30個です。</p>
					<p>アイテムをクリックすると、アイテムの詳細を確認できます。</p>
				</div>

				<hr className={styles["items-line"]} />

				<Suspense fallback={<ItemListSkeleton />}>
					<ItemCardList />
				</Suspense>
			</div>
		</>
	);
};

export default ItemsPage;
