import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PostsPage.module.css";
import ZennPosts from "@/features/posts/components/zenn-posts/ZennPosts";

export const metadata: Metadata = getPageMetadata("posts");

const PostsPage = () => {
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["posts-title"]}`}>学びの書</h1>
			<div className={`${styles["posts-content-container"]}`}>
				<ZennPosts />
			</div>
		</>
	);
};

export default PostsPage;
