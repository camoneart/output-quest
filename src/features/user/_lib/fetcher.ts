import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * ユーザー情報の型定義
 */
export type User = {
	id: string;
	clerkId: string;
	email: string | null;
	zennUsername: string | null;
	createdAt: Date;
	updatedAt: Date;
} | null;

/**
 * ユーザー情報を取得する関数（Request Memoization対応）
 *
 * React 19のcache()を使用して、同一リクエスト内で複数回呼び出されても
 * 実際のDB呼び出しは1回のみ実行される。
 *
 * @returns ユーザー情報（認証されていない場合はnull）
 */
export const getUser = cache(async (): Promise<User> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return null;
		}

		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
			select: {
				id: true,
				clerkId: true,
				email: true,
				zennUsername: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return user;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		return null;
	}
});

/**
 * ユーザー情報をプリロードする関数
 *
 * フェッチを早期に開始し、ウォーターフォールを防ぐために使用。
 * awaitせずに呼び出すことで、バックグラウンドでフェッチを開始する。
 */
export const preloadUser = () => {
	void getUser(); // Promiseを開始するだけ（awaitしない）
};
