import styles from "./EquipmentListSkeleton.module.css";

/**
 * EquipmentListSkeleton
 *
 * EquipmentDetailPageClient（装備品一覧）のスケルトンUI
 * データ読み込み中に表示し、CLS（Cumulative Layout Shift）を防ぐ
 *
 * レイアウト:
 * - 装備品一覧のリスト（6件分のスケルトンカード）
 * - 各カード: 画像、名前、説明文（2行）
 */
const EquipmentListSkeleton = () => {
	return (
		<ul className={styles["skeleton-list"]}>
			{[...Array(6)].map((_, index) => (
				<li key={index} className={styles["skeleton-item"]}>
					<div className={styles["skeleton-item-content"]}>
						{/* アイテム画像のスケルトン */}
						<div className={styles["skeleton-image"]} />

						{/* アイテム名のスケルトン */}
						<div className={styles["skeleton-name"]} />

						{/* 説明文のスケルトン */}
						<div className={styles["skeleton-description"]}>
							<div className={styles["skeleton-description-line"]} />
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default EquipmentListSkeleton;
