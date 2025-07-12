import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PartyPage.module.css";
import * as Party from "@/features/party/components/index";

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

				<Party.PartyMemberCardList />
			</div>
		</>
	);
};

export default PartyPage;
