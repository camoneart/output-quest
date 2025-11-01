import { Metadata } from "next";
import { Suspense } from "react";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PostsPage.module.css";
import ZennPosts from "@/features/posts/components/zenn-posts/ZennPosts";
import ZennPostsSkeleton from "@/features/posts/components/zenn-posts-skeleton/ZennPostsSkeleton";

export const metadata: Metadata = getPageMetadata("posts");

const PostsPage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["posts-title"]}`}>学びの書</h1>
			<div className={`${styles["posts-content-container"]}`}>
				<Suspense fallback={<ZennPostsSkeleton />}>
					<ZennPosts />
				</Suspense>
			</div>
		</>
	);
};

export default PostsPage;
