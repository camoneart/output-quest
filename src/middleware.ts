import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/connection(.*)",
  "/audio(.*)",
  "/api/user(.*)",
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
  // Clerkログイン保護
  await auth.protect();
  // Zenn連携が必要なページでは連携状況を確認
  if (isZennProtectedRoute(request)) {
    const cookie = request.headers.get("cookie") || "";
    const apiUrl = new URL("/api/user", request.url);
    const res = await fetch(apiUrl.toString(), { headers: { cookie } });
    const data = await res.json();
    if (!data.success || !data.user?.zennUsername) {
      return NextResponse.redirect(new URL("/connection", request.url));
    }
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
