import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./TitlePage.module.css";
import * as Title from "@/features/title/components/index";

export const metadata: Metadata = getPageMetadata("title");

const TitlePage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["title-page-title"]}`}>称号リスト</h1>
			<Title.TitlePageClient />
		</>
	);
};

export default TitlePage;
