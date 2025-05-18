import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Clerkからのウェブフックを検証するためのシークレット
  // 環境変数にSVIX_WEBHOOK_SECRETを設定する必要がある
  const WEBHOOK_SECRET = process.env.SVIX_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("SVIX_WEBHOOK_SECRETが設定されていません");
    return new NextResponse("Webhook Error", { status: 500 });
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

    // リクエストボディを取得
    const payload = await request.json();
    // const body = JSON.stringify(payload);

    // ウェブフックイベントの種類を確認
    const { type, data } = payload as WebhookEvent;

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

        // メールアドレスを取得
        const emailObject = email_addresses?.[0];
        const email = emailObject
          ? emailObject.email_address
          : `${id}@example.com`;

        // ユーザー名の設定
        const userName = username || `user_${id.substring(0, 8)}`;
        const displayName = first_name
          ? last_name
            ? `${first_name} ${last_name}`
            : first_name
          : userName;

        // Prismaでユーザーを作成
        await prisma.user.create({
          data: {
            clerkId: id,
            username: userName,
            email,
            displayName,
            profileImage: image_url,
            zennUsername: null,
            zennArticleCount: 0,
            level: 1,
          },
        });

        console.log(`ユーザー作成: ${id}`);
        break;
      }

      case "user.updated": {
        // ユーザー更新時の処理
        const {
          id,
          email_addresses,
          username,
          image_url,
          first_name,
          last_name,
        } = data;

        // メールアドレスを取得
        const emailObject = email_addresses?.[0];
        const email = emailObject ? emailObject.email_address : undefined;

        // ユーザー名の設定
        const userName = username || undefined;
        const displayName = first_name
          ? last_name
            ? `${first_name} ${last_name}`
            : first_name
          : undefined;

        // 更新データの準備（undefinedのフィールドは更新しない）
        const updateData: Record<string, string> = {};
        if (email) updateData.email = email;
        if (userName) updateData.username = userName;
        if (displayName) updateData.displayName = displayName;
        if (image_url) updateData.profileImage = image_url;

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
        const { id } = data;
        try {
          await prisma.user.delete({
            where: { clerkId: id },
          });
          console.log(`ユーザー削除: ${id}`);
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
