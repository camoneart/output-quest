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

export default clerkMiddleware((auth, request) => {
	// ゲストユーザーでも全ページ閲覧できるようにするため、
	// middlewareでのリダイレクト処理を削除し、すべてのリクエストを許可する。
	// 認証状態のチェックは、各ページのコンポーネント層に委ねる。
	return;
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
