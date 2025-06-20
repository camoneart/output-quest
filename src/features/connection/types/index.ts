// グローバル変数の型拡張
declare global {
	interface Window {
		__clerk_custom_signout_handler?: () => Promise<void>;
	}
}

// ユーザープロフィールの型定義
export interface UserInfo {
	id: string;
	clerkId: string;
	displayName?: string;
	zennUsername?: string;
	profileImage?: string;
	zennArticleCount: number;
	level: number;
}
