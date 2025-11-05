import { Suspense } from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ExplorePage.module.css";
import * as Explore from "@/features/explore/components";
import LoadingIndicator from "@/components/common/loading-indicator/LoadingIndicator";

export const metadata: Metadata = getPageMetadata("explore");

const ExplorePage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["explore-title"]}`}>記事探索</h1>
			<div className={`${styles["explorer-container"]}`}>
				<Suspense
					fallback={
						<div className="grid place-items-center pt-4">
							<LoadingIndicator fontSize="1.125rem" />
						</div>
					}
				>
					<Explore.ExplorePageClient />
				</Suspense>
			</div>
		</>
	);
};

export default ExplorePage;
