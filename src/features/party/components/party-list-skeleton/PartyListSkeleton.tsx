import styles from "./PartyListSkeleton.module.css";

/**
 * PartyListSkeleton
 *
 * パーティメンバー一覧のスケルトンUI
 * Suspense fallbackとして使用し、CLS（Cumulative Layout Shift）を防ぐ
 */
const PartyListSkeleton = () => {
	return (
		<div className={styles["skeleton-grid"]}>
			{[...Array(30)].map((_, index) => (
				<div key={index} className={styles["skeleton-card-content"]}>
					<div className={styles["skeleton-card"]}>
						<div className={styles["skeleton-icon-wrapper"]}>
							<div className={styles["skeleton-icon"]} />
						</div>
						<div className={styles["skeleton-name"]} />
					</div>
				</div>
			))}
		</div>
	);
};

export default PartyListSkeleton;
