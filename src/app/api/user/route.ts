import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// import { getUserStatus } from "@/utils/userStatus";

// キャッシュヘッダーを定義
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
} as const;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
} as const;

// リトライ機構のためのヘルパー関数（最適化版）
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2, // リトライ回数を削減
  delayMs: number = 200 // 初期遅延時間を短縮
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`操作失敗 (試行 ${attempt}/${maxRetries}):`, error);

      // 最後の試行でない場合は指数バックオフで待機
      if (attempt < maxRetries) {
        const waitTime = delayMs * Math.pow(2, attempt - 1); // 指数バックオフ
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }

  throw lastError;
};

// ユーザー情報の取得API
export async function GET() {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
			// ゲストユーザーの場合、デフォルトで@aoyamadevのZennアカウントが設定された情報を返す
      return NextResponse.json(
				{
					success: true,
					isGuestUser: true,
					user: {
						id: "guest",
						clerkId: null,
						username: "guest_user",
						email: null,
						displayName: "ゲストユーザー",
						profileImage: null,
						zennUsername: "aoyamadev",
						zennArticleCount: 0, // 実際の記事数は後で取得される
						level: 1,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				},
        {
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // リトライ付きでユーザー検索を実行（最適化版）
    const user = await retryOperation(async () => {
      return await prisma.user.findUnique({
        where: { clerkId: userId },
        // 必要なフィールドのみを選択してパフォーマンスを向上
        select: {
          id: true,
          clerkId: true,
          username: true,
          email: true,
          displayName: true,
          profileImage: true,
          zennUsername: true,
          zennArticleCount: true,
          level: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    if (!user) {
      // const elapsedTime = Date.now() - startTime; // 削除 (L83付近のエラー箇所)
      // 404ではなく、初回ユーザーとして適切なレスポンスを返す
      return NextResponse.json(
        {
          success: true,
          isNewUser: true,
          user: {
            id: null,
            clerkId: userId,
            username: `user_${userId.substring(0, 8)}`,
            email: null,
            displayName: null,
            profileImage: null,
            zennUsername: null,
            zennArticleCount: 0,
            level: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        {
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // const elapsedTime = Date.now() - startTime; // 削除 (L110付近のエラー箇所)
    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        headers: CACHE_HEADERS,
      }
    );
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(
      "ユーザー取得エラー:",
      error,
      `Elapsed time: ${elapsedTime}ms`
    );
    return NextResponse.json(
      { success: false, error: "ユーザー情報の取得に失敗しました" },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}

// ユーザー情報の更新API
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json(
        { success: false, error: "未認証" },
        {
          status: 401,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    const data = await request.json();
    const {
      zennUsername,
      displayName: reqDisplayName,
      profileImage: reqProfileImage,
      forceReset,
    } = data;

    // バリデーション追加
    if (zennUsername && typeof zennUsername !== "string") {
      return NextResponse.json(
        { success: false, error: "無効なユーザー名形式です" },
        {
          status: 400,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // リトライ付きでユーザー操作を実行（最適化版）
    const user = await retryOperation(async () => {
      // Clerkからメールアドレスを取得（upsertのために先に取得）
      const emailFromClerk =
        clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

      if (!emailFromClerk) {
        // emailFromClerk が undefined の場合、エラーを投げるか、
        // デフォルトのメールアドレスを設定するなどの対応が必要
        // ここではエラーを投げる例を示す
        throw new Error("Clerkからメールアドレスが取得できませんでした。");
      }

      const usernameForCreate = zennUsername || `user_${Date.now()}`;

			// 先に既存ユーザーをチェック（clerkIdまたはemailで）
			const existingUser = await prisma.user.findFirst({
				where: {
					OR: [{ clerkId: userId }, { email: emailFromClerk }],
				},
				select: {
					id: true,
					clerkId: true,
					username: true,
					email: true,
				},
			});

			if (existingUser) {
				// 既存ユーザーが見つかった場合は更新
				return await prisma.user.update({
					where: { id: existingUser.id },
					data: {
						clerkId: userId, // 最新のclerkIdに更新
						email: emailFromClerk, // メールアドレスも更新
          zennUsername,
          displayName:
            reqDisplayName && reqDisplayName.trim() !== ""
              ? reqDisplayName
              : `${clerkUser.firstName || ""} ${
                  clerkUser.lastName || ""
                }`.trim() || usernameForCreate,
          profileImage:
            reqProfileImage && reqProfileImage.trim() !== ""
              ? reqProfileImage
              : clerkUser.imageUrl,
          ...(zennUsername === "" || forceReset === true
            ? {
                zennArticleCount: 0,
                level: 1,
              }
            : {}),
        },
					select: {
						id: true,
						clerkId: true,
						username: true,
						email: true,
						displayName: true,
						profileImage: true,
						zennUsername: true,
						zennArticleCount: true,
						level: true,
						createdAt: true,
						updatedAt: true,
					},
				});
			} else {
				// 新規ユーザーを作成
				return await prisma.user.create({
					data: {
          clerkId: userId,
          username: usernameForCreate,
						email: emailFromClerk,
          zennUsername,
          displayName:
            reqDisplayName && reqDisplayName.trim() !== ""
              ? reqDisplayName
              : `${clerkUser.firstName || ""} ${
                  clerkUser.lastName || ""
                }`.trim() || usernameForCreate,
          profileImage:
            reqProfileImage && reqProfileImage.trim() !== ""
              ? reqProfileImage
              : clerkUser.imageUrl,
          zennArticleCount: 0,
          level: 1,
        },
        select: {
          id: true,
          clerkId: true,
          username: true,
          email: true,
          displayName: true,
          profileImage: true,
          zennUsername: true,
          zennArticleCount: true,
          level: true,
          createdAt: true,
          updatedAt: true,
        },
      });
			}
    });

    // const elapsedTime = Date.now() - startTime; // 削除 (L253付近のエラー箇所)
    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(
      "ユーザー更新エラー:",
      error,
      `Elapsed time: ${elapsedTime}ms`
    );

    // より詳細なエラー情報をログ出力
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
    }

    // Prismaエラーの場合は詳細を出力
    if (typeof error === "object" && error !== null && "code" in error) {
			const prismaError = error as { code?: string; meta?: any };
			console.error("Prismaエラーコード:", prismaError.code);
			console.error("Prismaエラーメタ:", prismaError.meta);

			// ユニーク制約違反の場合の特別な処理
			if (prismaError.code === "P2002") {
				console.error("ユニーク制約違反 - 詳細:", prismaError.meta);
				return NextResponse.json(
					{
						success: false,
						error: "このメールアドレスまたはユーザーIDは既に使用されています。",
					},
					{
						status: 409, // Conflict
						headers: NO_CACHE_HEADERS,
					}
				);
			}
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "ユーザー情報の更新に失敗しました。時間を空けて再度お試しください。",
      },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}

// Zenn記事数の更新API
export async function PUT(request: Request) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "未認証" },
        {
          status: 401,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    const data = await request.json();
    const { articleCount } = data;

    if (typeof articleCount !== "number" || articleCount < 0) {
      return NextResponse.json(
        { success: false, error: "有効な記事数を指定してください" },
        {
          status: 400,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    // 楽観的更新を使用してパフォーマンスを向上
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        zennArticleCount: articleCount,
        level: articleCount,
      },
      select: {
        id: true,
        clerkId: true,
        username: true,
        email: true,
        displayName: true,
        profileImage: true,
        zennUsername: true,
        zennArticleCount: true,
        level: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // const elapsedTime = Date.now() - startTime; // 削除 (L348付近のエラー箇所)
    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error("記事数更新エラー:", error, `Elapsed time: ${elapsedTime}ms`);

    // ユーザーが存在しない場合の特別なハンドリング
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "ユーザーが見つかりません" },
        {
          status: 404,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    return NextResponse.json(
      { success: false, error: "記事数の更新に失敗しました" },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}
