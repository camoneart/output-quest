import styles from "./DashboardActivitySkeleton.module.css";

/**
 * DashboardActivitySkeleton
 *
 * アクティビティセクションのスケルトンUI
 * Suspense fallbackとして使用し、CLS（Cumulative Layout Shift）を防ぐ
 *
 * 実際のDashboardActivityContentの構造に完全一致：
 * - recent-activity-section (親)
 * - recent-activity-section-title
 * - recent-activity-list (height: 400px, overflow-y: scroll)
 * - recent-activity-item (border: 7px dashed)
 *   - recent-activity-item-link
 *     - recent-activity-item-content
 *       - recent-activity-item-title
 *       - hr
 *       - recent-activity-item-info (category + date)
 *       - recent-activity-item-platform-container (favicon + platform)
 *     - recent-activity-item-exp
 */
const DashboardActivitySkeleton = () => {
	return (
		<section className={styles["skeleton-activity-section"]}>
			<h2 className={styles["skeleton-activity-title"]}>~ 最近の記録 ~</h2>

			<ul className={styles["skeleton-activity-list"]}>
				{[...Array(3)].map((_, index) => (
					<li key={index} className={styles["skeleton-activity-item"]}>
						<div className={styles["skeleton-activity-item-link"]}>
							<div className={styles["skeleton-activity-item-content"]}>
								{/* Title */}
								<div className={styles["skeleton-activity-item-title"]} />

								<hr />

								{/* Category and Date */}
								<div className={styles["skeleton-activity-item-info"]}>
									<div className={styles["skeleton-category"]} />
									<div className={styles["skeleton-date"]} />
								</div>

								{/* Platform (favicon + name) */}
								<div
									className={styles["skeleton-activity-item-platform-container"]}
								>
									<div className={styles["skeleton-favicon"]} />
									<div className={styles["skeleton-platform"]} />
								</div>
							</div>

							{/* EXP */}
							<div className={styles["skeleton-activity-item-exp"]} />
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export default DashboardActivitySkeleton;
