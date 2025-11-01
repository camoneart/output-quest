import styles from "./DashboardSkeleton.module.css";

/**
 * DashboardSkeleton
 *
 * ダッシュボードコンテンツのスケルトンUI
 * Suspense fallbackとして使用し、CLS（Cumulative Layout Shift）を防ぐ
 *
 * 実際のDashboardContentClientの構造に完全一致：
 * 1. dashboard-content-container (親)
 * 2. DashboardHeroSection
 * 3. <hr />
 * 4. dashboard-zenn-area (2カラムgrid)
 *    - DashboardPlatformStatsSection
 *    - DashboardActivitySection
 * 5. <hr />
 * 6. DashboardLatestPartyMemberSection
 * 7. <hr />
 * 8. DashboardLatestItemSection
 */
const DashboardSkeleton = () => {
	return (
		<div className={styles["skeleton-container"]}>
			{/* DashboardHeroSection Skeleton */}
			<section className={styles["skeleton-hero-section"]}>
				<h2 className={styles["skeleton-hero-title"]}>~ 勇者のレベル ~</h2>
				<div className={styles["skeleton-hero-container"]}>
					<div className={styles["skeleton-hero-info"]}>
						{/* 左側: アイコン + 名前 */}
						<div className={styles["skeleton-hero-box"]}>
							<div className={styles["skeleton-hero-icon-box"]}>
								<div className={styles["skeleton-hero-icon"]} />
							</div>
							<div className={styles["skeleton-hero-name-box"]}>
								<div className={styles["skeleton-hero-name"]} />
							</div>
						</div>

						{/* 右側: レベル + 経験値 */}
						<div className={styles["skeleton-hero-level"]}>
							<div className={styles["skeleton-hero-level-header"]}>
								<div className={styles["skeleton-hero-level-display"]} />
								<div className={styles["skeleton-hero-share"]} />
							</div>
							<div className={styles["skeleton-hero-progress-box"]}>
								<div className={styles["skeleton-hero-progress-text"]} />
								<div className={styles["skeleton-hero-progress-gauge-container"]}>
									<div className={styles["skeleton-hero-exp-icon"]} />
									<div className={styles["skeleton-hero-progress-gauge"]} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<hr />

			{/* dashboard-zenn-area */}
			<div className={styles["skeleton-zenn-area"]}>
				{/* DashboardPlatformStatsSection Skeleton */}
				<section className={styles["skeleton-platform-stats"]}>
					<h2 className={styles["skeleton-section-title"]} />
					<div className={styles["skeleton-platform-stats-container"]}>
						<div className={styles["skeleton-platform-card"]} />
						{/* Platform Stats Share Link */}
						<div className={styles["skeleton-platform-share"]} />
					</div>
				</section>

				<hr className="block md:hidden" />

				{/* DashboardActivitySection Skeleton */}
				<section className={styles["skeleton-activity"]}>
					<h2 className={styles["skeleton-section-title"]} />
					<div className={styles["skeleton-activity-list"]}>
						{[...Array(3)].map((_, index) => (
							<div key={index} className={styles["skeleton-activity-card"]} />
						))}
					</div>
				</section>
			</div>

			<hr />

			{/* DashboardLatestPartyMemberSection Skeleton */}
			<section className={styles["skeleton-latest-section"]}>
				<h2 className={styles["skeleton-section-title"]} />
				<div className={styles["skeleton-party-member-container"]}>
					<div className={styles["skeleton-party-member-guest"]} />
				</div>
				{/* Party Member Share Link */}
				<div className={styles["skeleton-party-share"]} />
			</section>

			<hr />

			{/* DashboardLatestItemSection Skeleton */}
			<section className={styles["skeleton-latest-section"]}>
				<h2 className={styles["skeleton-section-title"]} />
				<div className={styles["skeleton-last-item-container"]}>
					<div className={styles["skeleton-last-item-guest"]} />
				</div>
				{/* Last Item Share Link */}
				<div className={styles["skeleton-item-share"]} />
			</section>
		</div>
	);
};

export default DashboardSkeleton;
