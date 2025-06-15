import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./ExplorePage.module.css";
import * as Explore from "@/features/explore/components";

export const metadata: Metadata = getPageMetadata("explore");

const ExplorePage = () => {
	return (
		<>
			<Explore.ExplorePageClient />
		</>
	);
};

export default ExplorePage;
