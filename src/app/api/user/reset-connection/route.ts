import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

// リクエストのキャッシュを無効化するためのヘッダー
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// Zenn連携を強制解除するAPI
export async function DELETE(request: Request) {
  // ------------------------------------------------------------
  // Clerkの認証クッキーが失効している場合はリクエストボディの clerkId を利用
  // ------------------------------------------------------------
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
  try {
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

    try {
      // 該当ユーザーのデータを検索（clerkIdが一致するすべてのレコード）
      console.log(`ユーザーID: ${targetUserId} の連携情報を検索します`);

      // まずプリズマのコネクションをクリアして確実に最新データを取得
      await prisma.$disconnect();
      await prisma.$connect();

      // すべてのユーザーデータを検索
      const allUsers = await prisma.user.findMany({
        where: {
          clerkId: targetUserId,
        },
        take: 10, // 念のため上限を設定
      });

      console.log(`該当するユーザー数: ${allUsers.length}`);

      if (allUsers.length === 0) {
        console.log(
          `ユーザー ${targetUserId} が見つかりません。連携解除処理はスキップします。`
        );
        return NextResponse.json(
          {
            success: false,
            message: "ユーザーが見つかりません",
          },
          { headers: NO_CACHE_HEADERS }
        );
      }

      // すべてのユーザーの連携を解除（連携状態に関わらず）
      const updatePromises = allUsers.map((user: User) =>
        prisma.user.update({
          where: { id: user.id },
          data: {
            zennUsername: "",
            zennArticleCount: 0,
            level: 1,
          },
        })
      );

      // 全ての更新処理を並列実行
      const results = await Promise.all(updatePromises);
      console.log(`${results.length}人のユーザーの連携を解除しました`);

      // 連携解除の完全性を確保するためにupdateManyも実行
      const updateManyResult = await prisma.user.updateMany({
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

      console.log(`追加で${updateManyResult.count}件のレコードを更新しました`);

      // 念のためキャッシュをクリア
      await prisma.$disconnect();
      await prisma.$connect();

      // 最終確認
      const finalCheck = await prisma.user.findFirst({
        where: {
          clerkId: targetUserId,
          zennUsername: { not: "" },
        },
      });

      if (finalCheck) {
        console.error(
          `最終確認で連携が残っています: ${finalCheck.zennUsername}`
        );

        // 本当に最後の手段として直接SQLを実行
        try {
          await prisma.$executeRaw`UPDATE "User" SET "zennUsername" = '', "zennArticleCount" = 0, "level" = 1 WHERE "clerkId" = ${targetUserId}`;
          console.log("直接SQLによる更新を実行しました");
        } catch (sqlErr) {
          console.error("SQL実行エラー:", sqlErr);
        }
      } else {
        console.log("最終確認OK: すべての連携が解除されています");
      }

      return NextResponse.json(
        {
          success: true,
          message: "Zenn連携を強制解除しました",
          updatedCount: results.length + updateManyResult.count,
        },
        { headers: NO_CACHE_HEADERS }
      );
    } catch (dbError) {
      console.error("データベースエラー:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "データベース処理中にエラーが発生しました",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        {
          status: 500,
          headers: NO_CACHE_HEADERS,
        }
      );
    }
  } catch (error) {
    console.error("Zenn連携強制解除エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Zenn連携の強制解除に失敗しました",
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}
