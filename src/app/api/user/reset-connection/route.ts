import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// リクエストのキャッシュを無効化するためのヘッダー
const NO_CACHE_HEADERS = {
	"Cache-Control": "no-store, max-age=0, must-revalidate",
	Pragma: "no-cache",
	Expires: "0",
} as const;

// データベース操作の最大試行回数
const MAX_DB_RETRIES = 2;

// リトライ機構付きデータベース操作
const retryDbOperation = async <T>(
	operation: () => Promise<T>,
	maxRetries: number = MAX_DB_RETRIES
): Promise<T> => {
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;

			if (attempt < maxRetries) {
				// 指数バックオフで待機
				const waitTime = 100 * Math.pow(2, attempt - 1);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}
	}

	throw lastError;
};

// Zenn連携を強制解除するAPI
export async function DELETE(request: Request) {
	const startTime = Date.now();

	try {
		// Clerkの認証クッキーが失効している場合はリクエストボディの clerkId を利用
		const { userId } = await auth();
		let targetUserId: string | null | undefined = userId;

		if (!targetUserId) {
			try {
				const body = await request.json();
				if (body && typeof body.clerkId === "string") {
					targetUserId = body.clerkId;
				}
			} catch {
				// ボディが無い（＝JSONが読めない）場合は無視
			}
		}

		if (!targetUserId) {
			return NextResponse.json(
				{
					success: false,
					error: "認証情報がありません",
				},
				{
					status: 401,
					headers: NO_CACHE_HEADERS,
				}
			);
		}

		// 最適化されたデータベース操作
		const result = await retryDbOperation(async () => {
			// 該当ユーザーのデータを検索（トランザクション外）
			const usersToUpdate = await prisma.user.findMany({
				where: {
					clerkId: targetUserId,
				},
				select: {
					id: true,
					zennUsername: true,
				},
				take: 5, // 上限を設定してパフォーマンス向上
			});

			if (usersToUpdate.length === 0) {
				return {
					success: false,
					message: "ユーザーが見つかりません",
					updatedCount: 0,
				};
			}

			// 単一のupdateManyクエリで効率的に更新（トランザクション外）
			const updateResult = await prisma.user.updateMany({
				where: {
					clerkId: targetUserId,
				},
				data: {
					zennUsername: "",
					zennArticleCount: 0,
					level: 1,
				},
			});

			// 最終確認（必要な場合のみ）
			const remainingConnections = await prisma.user.count({
				where: {
					clerkId: targetUserId,
					zennUsername: { not: "" },
				},
			});

			if (remainingConnections > 0) {
				// 残りの連携を強制的に解除
				const finalUpdate = await prisma.user.updateMany({
					where: {
						clerkId: targetUserId,
						zennUsername: { not: "" },
					},
					data: {
						zennUsername: "",
						zennArticleCount: 0,
						level: 1,
					},
				});

				return {
					success: true,
					message: "Zenn連携を強制解除しました",
					updatedCount: updateResult.count + finalUpdate.count,
				};
			}

			return {
				success: true,
				message: "Zenn連携を強制解除しました",
				updatedCount: updateResult.count,
			};
		});

		return NextResponse.json(result, {
			headers: NO_CACHE_HEADERS,
		});
	} catch (error) {
		const elapsedTime = Date.now() - startTime;
		console.error("Zenn連携強制解除エラー:", error);

		// エラータイプに基づいた適切なレスポンス
		let errorMessage = "Zenn連携の強制解除に失敗しました";
		let statusCode = 500;

		if (error && typeof error === "object" && "code" in error) {
			const prismaError = error as { code?: string };
			switch (prismaError.code) {
				case "P2002":
					errorMessage = "データベース制約エラーが発生しました";
					statusCode = 409;
					break;
				case "P2025":
					errorMessage = "指定されたユーザーが見つかりません";
					statusCode = 404;
					break;
				default:
					errorMessage = "データベース処理中にエラーが発生しました";
			}
		}

		return NextResponse.json(
			{
				success: false,
				error: errorMessage,
				details: error instanceof Error ? error.message : String(error),
			},
			{
				status: statusCode,
				headers: NO_CACHE_HEADERS,
			}
		);
	}
}
