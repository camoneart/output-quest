import { Suspense } from "react";
import PostsListWithData from "../posts-list-with-data/PostsListWithData";
import ZennPostsSkeleton from "../zenn-posts-skeleton/ZennPostsSkeleton";
import styles from "./ZennPosts.module.css";

/**
 * ZennPosts (Server Component - Synchronous)
 *
 * Zenn記事一覧表示のコンテナコンポーネント
 * posts-headerを即座に表示し、PostsListWithDataをSuspenseで囲む
 *
 * レイアウト:
 * - posts-header: 静的テキスト（即座に表示）
 * - PostsListWithData: Suspense境界内（データフェッチ中はスケルトン表示）
 */
const ZennPosts = () => {
	return (
		<div className={styles["posts-container"]}>
			<div className={`${styles["posts-header"]}`}>
				<p>Zennの記事を「これまでの学び」として記録する場所。</p>
				<p>
					Zennで投稿した記事が一覧表示され、学びの記録として振り返ることができます。
				</p>
			</div>

			<hr className={styles["posts-container-line"]} />

			<Suspense fallback={<ZennPostsSkeleton />}>
				<PostsListWithData />
			</Suspense>
		</div>
	);
};

export default ZennPosts;
