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
      console.error(`DB操作失敗 (試行 ${attempt}/${maxRetries}):`, error);

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

    console.log(`連携解除API呼び出し: userId=${targetUserId || "なし"}`);

    if (!targetUserId) {
      console.log("認証されていないため、処理を続行できません (targetUserId)");
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
      console.log(`ユーザーID: ${targetUserId} の連携情報を検索します`);

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

      console.log(`該当するユーザー数: ${usersToUpdate.length}`);

      if (usersToUpdate.length === 0) {
        console.log(
          `ユーザー ${targetUserId} が見つかりません。連携解除処理はスキップします。`
        );
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

      console.log(`${updateResult.count}件のレコードを更新しました`);

      // 最終確認（必要な場合のみ）
      const remainingConnections = await prisma.user.count({
        where: {
          clerkId: targetUserId,
          zennUsername: { not: "" },
        },
      });

      if (remainingConnections > 0) {
        console.warn(`最終確認で${remainingConnections}件の連携が残っています`);

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

        console.log(`追加で${finalUpdate.count}件を更新しました`);

        return {
          success: true,
          message: "Zenn連携を強制解除しました",
          updatedCount: updateResult.count + finalUpdate.count,
        };
      }

      console.log("連携解除完了: すべての連携が正常に解除されました");

      return {
        success: true,
        message: "Zenn連携を強制解除しました",
        updatedCount: updateResult.count,
      };
    });

    const elapsedTime = Date.now() - startTime;
    console.log(`連携解除処理完了。処理時間: ${elapsedTime}ms`);

    return NextResponse.json(result, {
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(
      "Zenn連携強制解除エラー:",
      error,
      `処理時間: ${elapsedTime}ms`
    );

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
