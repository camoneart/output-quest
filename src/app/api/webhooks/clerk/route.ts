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
  profileImage?: string | null; // profileImage は null も許容
};

// ユーザー作成のためのロック機構（メモリベース、簡易版）
const userCreationLocks = new Map<string, Promise<void>>();

// ユーザー作成処理の冪等性を確保する関数
async function ensureUserExists(
  clerkId: string,
  userData?: {
    username?: string;
    email?: string;
    displayName?: string;
    profileImage?: string;
  }
) {
  // 既存のロックがあるかチェック
  const existingLock = userCreationLocks.get(clerkId);
  if (existingLock) {
    console.log(`ユーザー ${clerkId} の作成処理を待機中...`);
    await existingLock;
    return;
  }

  // 新しいロックを作成
  const lock = (async () => {
    try {
      // まず既存ユーザーをチェック
      const existingUser = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (existingUser) {
        console.log(`ユーザー ${clerkId} は既に存在します`);
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
        console.log(`ユーザー作成完了: ${clerkId}`);
      } else {
        console.log(`ユーザー ${clerkId} の作成に必要なデータが不足しています`);
      }
    } catch (error) {
      console.error(`ユーザー ${clerkId} の作成エラー:`, error);
      throw error;
    } finally {
      // ロックを削除
      userCreationLocks.delete(clerkId);
    }
  })();

  userCreationLocks.set(clerkId, lock);
  await lock;
}

export async function POST(request: Request) {
  // Clerkからのウェブフックを検証するためのシークレット
  // 環境変数にCLERK_WEBHOOK_SIGNING_SECRETを設定する必要がある
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRETが設定されていません");
    return new NextResponse(
      "Webhook Error: CLERK_WEBHOOK_SIGNING_SECRET not set",
      {
        status: 500,
      }
    );
  }

  try {
    // リクエストヘッダーを取得
    const headersList = await headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    // 必要なヘッダーがない場合はエラー
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.text(); // raw body needed for Svix signature verification

    // Svix Webhook インスタンスを作成
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    // 署名を検証
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook署名の検証エラー:", err);
      return new NextResponse("Error occurred -- Invalid signature", {
        status: 400,
      });
    }

    // ウェブフックイベントの種類を確認
    const { type, data } = evt;
    console.log(`Webhook受信: ${type} for user ${data.id || "unknown"}`);

    switch (type) {
      case "user.created": {
        // ユーザー作成時の処理
        const {
          id,
          email_addresses,
          username,
          image_url,
          first_name,
          last_name,
        } = data;

        // メールアドレスを取得 (プライマリまたは最初のメールアドレス)
        const primaryEmail = email_addresses.find(
          (e) => e.id === data.primary_email_address_id
        )?.email_address;
        const email = primaryEmail || email_addresses[0]?.email_address;

        if (!email) {
          console.error(`Webhook user.created: Email not found for user ${id}`);
          return new NextResponse("Webhook Error: Email not found", {
            status: 400,
          });
        }

        // ユーザー名の設定
        const userName = username || `user_${id.substring(0, 8)}`;
        const displayName = first_name
          ? last_name
            ? `${first_name} ${last_name}`
            : first_name
          : userName;

        // 改善されたユーザー作成処理
        await ensureUserExists(id, {
          username: userName,
          email,
          displayName,
          profileImage: image_url,
        });

        console.log(`user.created処理完了: ${id}`);
        break;
      }

      case "user.updated": {
        // ユーザー更新時の処理
        const {
          id,
          email_addresses,
          primary_email_address_id,
          username,
          image_url,
          first_name,
          last_name,
        } = data;

        // メールアドレスを取得 (プライマリまたは最初のメールアドレス)
        // primary_email_address_id が payload に含まれているか確認
        const primaryEmailPayload = email_addresses.find(
          (e) => e.id === primary_email_address_id
        );
        const currentEmail = primaryEmailPayload
          ? primaryEmailPayload.email_address
          : email_addresses[0]?.email_address;

        // ユーザー名の設定
        const userName = username || undefined;
        const displayName = first_name
          ? last_name
            ? `${first_name} ${last_name}`
            : first_name
          : undefined;

        // 更新データの準備（undefinedのフィールドは更新しない）
        const updateData: UserUpdateData = {};
        if (currentEmail) updateData.email = currentEmail;
        if (userName) updateData.username = userName;
        if (displayName) updateData.displayName = displayName;
        if (image_url !== undefined) updateData.profileImage = image_url;

        // データがある場合のみ更新
        if (Object.keys(updateData).length > 0) {
          try {
            await prisma.user.update({
              where: { clerkId: id },
              data: updateData,
            });
            console.log(`ユーザー更新: ${id}`);
          } catch (error) {
            console.error(`ユーザー更新エラー: ${id}`, error);
          }
        }
        break;
      }

      case "user.deleted": {
        // ユーザー削除時の処理
        const { id, deleted } = data; // deleted フラグも考慮
        if (!id) {
          console.error("Webhook user.deleted: ID not found in payload");
          return new NextResponse("Webhook Error: ID not found", {
            status: 400,
          });
        }
        try {
          // ユーザーが存在するか確認してから削除 (オプショナルだが安全)
          const existingUser = await prisma.user.findUnique({
            where: { clerkId: id },
          });
          if (existingUser) {
            await prisma.user.delete({
              where: { clerkId: id },
            });
            console.log(`ユーザー削除: ${id}`);
          } else if (deleted) {
            // Clerk側で削除済みだがDBに存在しない場合 (同期漏れの可能性)
            console.log(`ユーザー削除済み (Clerk上): ${id}, DBにレコードなし`);
          } else {
            console.log(`ユーザー削除要求: ${id}, DBにレコードなし`);
          }
        } catch (error) {
          console.error(`ユーザー削除エラー: ${id}`, error);
        }
        break;
      }

      default:
        // その他のイベントは無視
        console.log(`その他のウェブフックイベント: ${type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ウェブフックエラー:", error);
    return NextResponse.json(
      { success: false, error: "ウェブフック処理に失敗しました" },
      { status: 500 }
    );
  }
}
