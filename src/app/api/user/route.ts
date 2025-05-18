import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// import { getUserStatus } from "@/utils/userStatus";

// ユーザー情報の取得API
export async function GET() {
  console.log("GET /api/user called");
  try {
    const { userId } = await auth();
    console.log("userId from auth():", userId);

    if (!userId) {
      console.log("User not authenticated in GET /api/user, returning 401");
      return NextResponse.json(
        { success: false, error: "未認証" },
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // ユーザーが見つからなかった場合、1秒待ってから再試行
    if (!user) {
      console.log(
        `User ${userId} not found on first attempt. Retrying in 1 second...`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待機
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
    }

    if (!user) {
      console.log(`User ${userId} not found after retry.`);
      return NextResponse.json(
        { success: false, error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // ステータス情報を計算
    // const statusInfo = getUserStatus(user.zennArticleCount);

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        // statusInfo,
      },
    });
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    return NextResponse.json(
      { success: false, error: "ユーザー情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ユーザー情報の更新API
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "未認証" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { zennUsername, displayName, profileImage, forceReset } = data;

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    let user;

    if (existingUser) {
      // 既存ユーザーの更新
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          zennUsername,
          displayName: displayName || existingUser.displayName,
          profileImage: profileImage || existingUser.profileImage,
          ...(zennUsername === "" || forceReset === true
            ? {
                zennArticleCount: 0,
                level: 1,
              }
            : {}),
        },
      });
    } else {
      // 新規ユーザーの作成
      const username = zennUsername || `user_${Date.now()}`;
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          username,
          email: `${username}@example.com`,
          zennUsername,
          displayName: displayName || username,
          profileImage,
          zennArticleCount: 0,
          level: 1,
        },
      });
    }

    // ステータス情報を計算して返す
    // const statusInfo = getUserStatus(user.zennArticleCount);

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        // statusInfo,
      },
    });
  } catch (error) {
    console.error("ユーザー更新エラー:", error);
    return NextResponse.json(
      { success: false, error: "ユーザー情報の更新に失敗しました" },
      { status: 500 }
    );
  }
}

// Zenn記事数の更新API
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "未認証" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { articleCount } = data;

    if (typeof articleCount !== "number" || articleCount < 0) {
      return NextResponse.json(
        { success: false, error: "有効な記事数を指定してください" },
        { status: 400 }
      );
    }

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 記事数とレベルの更新（1記事＝1レベル）
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        zennArticleCount: articleCount,
        level: articleCount,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        // statusInfo: getUserStatus(user.zennArticleCount),
      },
    });
  } catch (error) {
    console.error("記事数更新エラー:", error);
    return NextResponse.json(
      { success: false, error: "記事数の更新に失敗しました" },
      { status: 500 }
    );
  }
}
