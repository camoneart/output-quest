import styles from "./DashboardSkeleton.module.css";

/**
 * DashboardSkeleton
 *
 * ダッシュボードコンテンツのスケルトンUI
 * Suspense fallbackとして使用し、CLS（Cumulative Layout Shift）を防ぐ
 */
const DashboardSkeleton = () => {
	return (
		<div className={styles["skeleton-container"]}>
			{/* Hero Section Skeleton */}
			<div className={styles["skeleton-hero"]}>
				<div className={styles["skeleton-avatar"]} />
				<div className={styles["skeleton-text-group"]}>
					<div className={styles["skeleton-text-long"]} />
					<div className={styles["skeleton-text-medium"]} />
					<div className={styles["skeleton-text-short"]} />
				</div>
			</div>

			{/* Activity Section Skeleton */}
			<div className={styles["skeleton-activity"]}>
				<div className={styles["skeleton-activity-title"]} />
				<div className={styles["skeleton-article-list"]}>
					{[...Array(3)].map((_, index) => (
						<div key={index} className={styles["skeleton-article-card"]}>
							<div className={styles["skeleton-text-medium"]} />
							<div className={styles["skeleton-text-short"]} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DashboardSkeleton;
