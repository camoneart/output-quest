/**
 * キャッシュタグの定義
 *
 * Next.jsの`unstable_cache`と`revalidateTag()`で使用するタグを
 * 一元管理するためのファイル。
 *
 * Part 3「データ操作とServer Actions」に基づく実装。
 */

export const CacheTags = {
	/**
	 * ユーザーデータのキャッシュタグ
	 * @param clerkId - Clerk認証のユーザーID
	 * @returns "user-{clerkId}" 形式のタグ
	 */
	user: (clerkId: string) => `user-${clerkId}` as const,

	/**
	 * Zenn記事のキャッシュタグ
	 * @param username - Zennユーザー名
	 * @returns "zenn-{username}" 形式のタグ
	 */
	zennArticles: (username: string) => `zenn-${username}` as const,

	/**
	 * ダッシュボードデータのキャッシュタグ
	 * @param clerkId - Clerk認証のユーザーID
	 * @returns "dashboard-{clerkId}" 形式のタグ
	 */
	dashboard: (clerkId: string) => `dashboard-${clerkId}` as const,
} as const;

/**
 * キャッシュタグの型定義
 */
export type CacheTag =
	| ReturnType<typeof CacheTags.user>
	| ReturnType<typeof CacheTags.zennArticles>
	| ReturnType<typeof CacheTags.dashboard>;
