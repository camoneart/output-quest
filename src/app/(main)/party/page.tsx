import { Suspense } from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PartyPage.module.css";
import PartyMemberCardList from "@/features/party/components/party-member-card-list/PartyMemberCardList";
import PartyListSkeleton from "@/features/party/components/party-list-skeleton/PartyListSkeleton";

export const metadata: Metadata = getPageMetadata("party");

const PartyPage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["party-title"]}`}>なかま</h1>
			<div className={`${styles["party-container"]}`}>
				<div className={`${styles["party-header"]}`}>
					<p>勇者の仲間を確認できます。</p>
					<p>仲間になるキャラクターは最大で30人です。</p>
					<p>仲間をクリックすると、仲間の詳細を確認できます。</p>
				</div>

				<hr className={styles["party-line"]} />

				<Suspense fallback={<PartyListSkeleton />}>
					<PartyMemberCardList />
				</Suspense>
			</div>
		</>
	);
};

export default PartyPage;
