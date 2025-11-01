import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ExplorePage.module.css";
import * as Explore from "@/features/explore/components";

export const metadata: Metadata = getPageMetadata("explore");

const ExplorePage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["explore-title"]}`}>記事探索</h1>
			<div className={`${styles["explorer-container"]}`}>
				<Explore.ExplorePageClient />
			</div>
		</>
	);
};

export default ExplorePage;
