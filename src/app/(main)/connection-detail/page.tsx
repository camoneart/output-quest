import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ConnectionDetailPage.module.css";
import * as ConnectionDetail from "@/features/connection-detail/components/index";

export const metadata: Metadata = getPageMetadata("connectionDetail");

const ConnectionDetailPage = () => {
	return (
		<>
			<h1 className={`${styles["connection-detail-title"]}`}>
				Zennとの連携について
			</h1>
			<div className={`${styles["connection-detail-container"]}`}>
				<div className={`${styles["connection-detail-content-wrapper"]} w-full`}>
					<ConnectionDetail.ConnectionDetailContent />
				</div>
			</div>
		</>
	);
};

export default ConnectionDetailPage;
