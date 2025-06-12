import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PrismaのUserモデルで更新可能なフィールドを定義
type UserUpdateData = {
  email?: string;
  username?: string;
  displayName?: string;
  profileImage?: string | null;
};

// より効率的なインメモリキャッシュ
const userCreationCache = new Map<
  string,
  {
    promise: Promise<void>;
    timestamp: number;
  }
>();

// キャッシュのクリーンアップ間隔（5分）
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;
const CACHE_ENTRY_TTL = 2 * 60 * 1000; // 2分でエントリを期限切れ

// 定期的なキャッシュクリーンアップ
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of userCreationCache.entries()) {
    if (now - entry.timestamp > CACHE_ENTRY_TTL) {
      userCreationCache.delete(key);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

// 最適化されたユーザー作成処理
async function ensureUserExists(
  clerkId: string,
  userData?: {
    username?: string;
    email?: string;
    displayName?: string;
    profileImage?: string;
  }
) {
  // 既存のキャッシュエントリをチェック
  const existingEntry = userCreationCache.get(clerkId);
  if (existingEntry) {
    await existingEntry.promise;
    return;
  }

  // 新しい処理を作成
  const userCreationPromise = (async () => {
    try {
      // 効率的な存在確認（selectを使用）
      const existingUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      });

      if (existingUser) {
        return;
      }

      // ユーザーデータが提供されている場合のみ作成
      if (userData && userData.email) {
        const userName = userData.username || `user_${clerkId.substring(0, 8)}`;

        await prisma.user.create({
          data: {
            clerkId,
            username: userName,
            email: userData.email,
            displayName: userData.displayName || userName,
            profileImage: userData.profileImage,
            zennUsername: null,
            zennArticleCount: 0,
            level: 1,
          },
        });
      }
    } catch (error) {
      console.error(`ユーザー ${clerkId} の作成エラー:`, error);
      throw error;
    } finally {
      // キャッシュから削除
      userCreationCache.delete(clerkId);
    }
  })();

  // キャッシュに追加
  userCreationCache.set(clerkId, {
    promise: userCreationPromise,
    timestamp: Date.now(),
  });

  await userCreationPromise;
}

export async function POST(request: Request) {
  const startTime = Date.now();

  // 環境変数チェック
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRETが設定されていません");
    return new NextResponse(
      "Webhook Error: CLERK_WEBHOOK_SIGNING_SECRET not set",
      { status: 500 }
    );
  }

  try {
    // ヘッダー取得の最適化
    const headersList = await headers();
    const svixHeaders = {
      id: headersList.get("svix-id"),
      timestamp: headersList.get("svix-timestamp"),
      signature: headersList.get("svix-signature"),
    };

    // 必要なヘッダーがない場合はエラー
    if (!svixHeaders.id || !svixHeaders.timestamp || !svixHeaders.signature) {
      return new NextResponse("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.text();

    // Svix Webhook インスタンスを作成して署名検証
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        "svix-id": svixHeaders.id,
        "svix-timestamp": svixHeaders.timestamp,
        "svix-signature": svixHeaders.signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook署名の検証エラー:", err);
      return new NextResponse("Error occurred -- Invalid signature", {
        status: 400,
      });
    }

    const { type, data } = evt;

    switch (type) {
      case "user.created": {
        const {
          id,
          email_addresses,
          username,
          image_url,
          first_name,
          last_name,
        } = data;

        // メールアドレス取得の最適化
        const primaryEmail =
          email_addresses.find((e) => e.id === data.primary_email_address_id)
            ?.email_address || email_addresses[0]?.email_address;

        if (!primaryEmail) {
          console.error(`Webhook user.created: Email not found for user ${id}`);
          return new NextResponse("Webhook Error: Email not found", {
            status: 400,
          });
        }

        // 表示名の効率的な生成
        const userName = username || `user_${id.substring(0, 8)}`;
        const displayName = first_name
          ? `${first_name}${last_name ? ` ${last_name}` : ""}`
          : userName;

        await ensureUserExists(id, {
          username: userName,
          email: primaryEmail,
          displayName,
          profileImage: image_url,
        });

        break;
      }

      case "user.updated": {
        const {
          id,
          email_addresses,
          primary_email_address_id,
          username,
          image_url,
          first_name,
          last_name,
        } = data;

        // メールアドレス取得の最適化
        const currentEmail =
          email_addresses.find((e) => e.id === primary_email_address_id)
            ?.email_address || email_addresses[0]?.email_address;

        // 表示名の効率的な生成
        const displayName = first_name
          ? `${first_name}${last_name ? ` ${last_name}` : ""}`
          : undefined;

        // 更新データの準備（undefinedのフィールドは除外）
        const updateData: UserUpdateData = {};
        if (currentEmail) updateData.email = currentEmail;
        if (username) updateData.username = username;
        if (displayName) updateData.displayName = displayName;
        if (image_url !== undefined) updateData.profileImage = image_url;

        // データがある場合のみ更新
        if (Object.keys(updateData).length > 0) {
          try {
            await prisma.user.update({
              where: { clerkId: id },
              data: updateData,
            });
          } catch (error) {
            // ユーザーが存在しない場合の特別処理
            if (
              error &&
              typeof error === "object" &&
              "code" in error &&
              (error as { code?: string }).code === "P2025"
            ) {
              // ユーザーが存在しない場合はスキップ
            } else {
              console.error(`ユーザー更新エラー: ${id}`, error);
            }
          }
        }
        break;
      }

      case "user.deleted": {
        const { id } = data;
        if (!id) {
          console.error("Webhook user.deleted: ID not found in payload");
          return new NextResponse("Webhook Error: ID not found", {
            status: 400,
          });
        }

        try {
          // 楽観的削除（存在チェックなし）
          await prisma.user.delete({
            where: { clerkId: id },
          });
        } catch (error) {
          // ユーザーが存在しない場合は警告のみ
          if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            (error as { code?: string }).code === "P2025"
          ) {
            // ユーザーが既に削除されている場合はスキップ
          } else {
            console.error(`ユーザー削除エラー: ${id}`, error);
          }
        }
        break;
      }

      default:
        // その他のイベントは無視
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error("ウェブフックエラー:", error);
    return NextResponse.json(
      { success: false, error: "ウェブフック処理に失敗しました" },
      { status: 500 }
    );
  }
}
