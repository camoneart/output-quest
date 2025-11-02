import styles from "./ItemDetailSkeleton.module.css";

/**
 * ItemDetailSkeleton
 *
 * ItemDetailClient（アイテム詳細）のスケルトンUI
 * データ読み込み中に表示し、CLS（Cumulative Layout Shift）を防ぐ
 *
 * レイアウト:
 * - アイテム画像エリア（200px高さ）
 * - アイテム名エリア
 * - 説明文エリア（2行）
 * - レア度エリア
 */
const ItemDetailSkeleton = () => {
	return (
		<div className={styles["skeleton-card"]}>
			<div className={styles["skeleton-card-content"]}>
				{/* アイテム画像のスケルトン */}
				<div className={styles["skeleton-image-box"]}>
					<div className={styles["skeleton-image"]} />
				</div>

				{/* アイテム名のスケルトン */}
				<div className={styles["skeleton-title-box"]}>
					<div className={styles["skeleton-title"]} />
				</div>

				{/* 説明文のスケルトン */}
				<div className={styles["skeleton-description-box"]}>
					<div className={styles["skeleton-description-line"]} />
				</div>

				{/* レア度のスケルトン */}
				<div className={styles["skeleton-rarity-box"]}>
					<div className={styles["skeleton-rarity-label"]} />
					<div className={styles["skeleton-rarity-stars"]} />
				</div>
			</div>
		</div>
	);
};

export default ItemDetailSkeleton;
