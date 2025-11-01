"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../item-card-list/ItemCardList.module.css";
import * as Items from "@/features/items/components/index";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import { Item } from "@/features/items/types/items.types";

interface ItemCardListClientProps {
	items: Item[];
	isGuestUser: boolean;
}

const ItemCardListClient: React.FC<ItemCardListClientProps> = ({
	items,
	isGuestUser,
}) => {
	const router = useRouter();
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	return (
		<div className={styles["items-grid"]}>
			{items.map((item) => (
				<div className={`${styles["item-card-content"]}`} key={item.id}>
					<Link
						href={`/items/${item.id}`}
						className={styles["item-card"]}
						onClick={(e) => handleNavigation(e, `/items/${item.id}`)}
					>
						{isGuestUser ? (
							<div className={styles["unacquired-item-icon"]}>
								<Items.ItemsTreasureChestIcon
									width={40}
									height={40}
									className={styles["unacquired-item-icon-image"]}
								/>
							</div>
						) : item.acquired ? (
							<div className={styles["acquired-item-icon"]}>
								<Image
									src={`/images/items-page/acquired-icon/item-${item.id}.svg`}
									alt={item.name || "アイテム"}
									width={40}
									height={40}
									className={`${styles["acquired-item-icon-image"]} ${
										styles[`acquired-item-icon-image-${item.id}`]
									}`}
								/>
							</div>
						) : (
							<div className={styles["unacquired-item-icon"]}>
								<Items.ItemsTreasureChestIcon
									width={40}
									height={40}
									className={styles["unacquired-item-icon-image"]}
								/>
							</div>
						)}
						<h2 className={styles["item-name"]}>
							{isGuestUser || !item.acquired ? "???" : item.name}
						</h2>
					</Link>
				</div>
			))}
		</div>
	);
};

export default ItemCardListClient;
