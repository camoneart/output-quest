import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ConnectionDetailPage.module.css";
import * as ConnectionDetail from "@/features/ConnectionDetail/components/index";

export const metadata: Metadata = getPageMetadata("connection-detail");

const ConnectionDetailPage = () => {
	return (
		<>
			<h2 className={`${styles["connection-detail-title"]}`}>Zennとの連携について</h2>
			<div className={`${styles["connection-detail-container"]}`}>
				<div className={`${styles["connection-detail-content-box"]} w-full`}>
					<ConnectionDetail.ConnectionDetailContent />
				</div>
			</div>
		</>
	);
};

export default ConnectionDetailPage;
