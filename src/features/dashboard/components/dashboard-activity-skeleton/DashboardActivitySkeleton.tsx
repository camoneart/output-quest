import styles from "./DashboardActivitySkeleton.module.css";

/**
 * DashboardActivitySkeleton
 *
 * アクティビティセクションのスケルトンUI
 * Suspense fallbackとして使用し、CLS（Cumulative Layout Shift）を防ぐ
 */
const DashboardActivitySkeleton = () => {
	return (
		<div className={styles["skeleton-activity"]}>
			<div className={styles["skeleton-title"]} />
			<div className={styles["skeleton-article-list"]}>
				{[...Array(3)].map((_, index) => (
					<div key={index} className={styles["skeleton-article-card"]}>
						<div className={styles["skeleton-text-long"]} />
						<div className={styles["skeleton-text-medium"]} />
						<div className={styles["skeleton-text-short"]} />
					</div>
				))}
			</div>
		</div>
	);
};

export default DashboardActivitySkeleton;
