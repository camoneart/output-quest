import styles from "./DashboardLatestPartyMemberSkeleton.module.css";

const DashboardLatestPartyMemberSkeleton = () => {
	return (
		<div className={styles["skeleton-box"]}>
			<div className={styles["skeleton-link"]}>
				<div className={styles["skeleton-icon"]} />
				<div className={styles["skeleton-info"]}>
					<div className={styles["skeleton-name"]} />
					<div className={styles["skeleton-description"]} />
				</div>
			</div>
		</div>
	);
};

export default DashboardLatestPartyMemberSkeleton;
