import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/connection(.*)",
  "/audio(.*)",
  "/api/user(.*)",
  "/api/webhooks/clerk(.*)",
  "/privacy",
  "/terms",
]);
const isZennProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/posts(.*)",
  "/strength(.*)",
  "/title(.*)",
  "/equipment(.*)",
  "/logs(.*)",
  "/party(.*)",
  "/items(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // 公開ルートはいったんスキップ
  if (isPublicRoute(request)) {
    return;
  }

  // Zenn連携が必要なページにアクセスしようとしている場合
  if (
    isZennProtectedRoute(request) &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    // まずユーザーがサインインしているかチェック
    const { userId } = await auth();

    if (!userId) {
      // サインインしていない場合は/connectionにリダイレクト
      return NextResponse.redirect(new URL("/connection", request.url));
    }

    // サインインしている場合はZenn連携状況をチェック
    const cookie = request.headers.get("cookie") || "";
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const apiUrl = new URL(`${protocol}://${host}/api/user`);

    const res = await fetch(apiUrl.toString(), { headers: { cookie } });
    const data = await res.json();
    if (!data.success || !data.user?.zennUsername) {
      return NextResponse.redirect(new URL("/connection", request.url));
    }
  } else {
    // Zenn連携が不要なページの場合は通常のClerk保護
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
