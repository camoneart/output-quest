"use server";

import { revalidateTag } from "next/cache";
import { CacheTags } from "@/lib/cache-tags";

/**
 * ユーザーデータのキャッシュを無効化するServer Action
 *
 * Part 3「データ操作とServer Actions」に基づく実装。
 * revalidateTag()を使用して、特定ユーザーのキャッシュを無効化する。
 *
 * Next.js 16: revalidateTag(tag, profile)の2引数形式を使用。
 * 'max'プロファイルはstale-while-revalidate戦略を適用。
 *
 * 注意: revalidateTag()は全てのRouter Cacheも破棄するため、
 * 必要以上に多用しないこと。
 *
 * @param clerkId - Clerk認証のユーザーID
 */
export async function revalidateUserCache(clerkId: string): Promise<void> {
	try {
		revalidateTag(CacheTags.user(clerkId), "max");
		revalidateTag(CacheTags.dashboard(clerkId), "max");
		console.log(`Revalidated cache for user: ${clerkId}`);
	} catch (error) {
		console.error("Failed to revalidate user cache:", error);
		throw error;
	}
}

/**
 * Zenn記事のキャッシュを無効化するServer Action
 *
 * Zennで新しい記事を投稿した時や、記事を更新した時に呼び出す。
 *
 * Next.js 16: revalidateTag(tag, profile)の2引数形式を使用。
 * 'max'プロファイルはstale-while-revalidate戦略を適用。
 *
 * @param username - Zennユーザー名
 */
export async function revalidateZennArticlesCache(
	username: string
): Promise<void> {
	try {
		revalidateTag(CacheTags.zennArticles(username), "max");
		console.log(`Revalidated cache for Zenn articles: ${username}`);
	} catch (error) {
		console.error("Failed to revalidate Zenn articles cache:", error);
		throw error;
	}
}
