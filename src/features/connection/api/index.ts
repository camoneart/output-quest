import { UserInfo } from "../types";

// ユーザー情報を取得するAPI
export const fetchUserInfo = async (): Promise<{
	success: boolean;
	user?: UserInfo;
	isNewUser?: boolean;
	error?: string;
}> => {
	const response = await fetch("/api/user");
	const data = await response.json();
	return data;
};

// ユーザープロフィールを更新するAPI
export const updateUserProfile = async (
	zennUsername: string,
	displayName?: string,
	profileImage?: string,
	forceReset?: boolean
): Promise<{
	success: boolean;
	user?: UserInfo;
	error?: string;
}> => {
	const response = await fetch("/api/user", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			zennUsername,
			displayName,
			profileImage,
			forceReset,
		}),
	});
	const data = await response.json();
	return data;
};

// 記事数を更新するAPI
export const updateArticleCount = async (
	articleCount: number
): Promise<{
	success: boolean;
	user?: UserInfo;
	error?: string;
}> => {
	const response = await fetch("/api/user", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			articleCount,
		}),
	});
	const data = await response.json();
	return data;
};

// Zennユーザーの存在を確認するAPI
export const checkZennUser = async (
	username: string
): Promise<{
	success: boolean;
	articles?: any[];
	totalCount?: number;
	error?: string;
}> => {
	const checkTimestamp = Date.now();
	const response = await fetch(
		`/api/zenn?username=${username}&bustCache=true&_t=${checkTimestamp}`,
		{
			method: "GET",
			cache: "no-store",
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			},
		}
	);
	const data = await response.json();
	return data;
};

// Zenn記事を同期するAPI
export const syncZennArticles = async (
	username: string
): Promise<{
	success: boolean;
	user?: UserInfo;
	articles?: any[];
	totalCount?: number;
	error?: string;
}> => {
	const timestamp = Date.now();
	const response = await fetch(
		`/api/zenn?username=${username}&updateUser=true&bustCache=true&_t=${timestamp}`,
		{
			method: "GET",
			cache: "no-store",
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			},
		}
	);
	const data = await response.json();
	return data;
};

// 連携をリセットするAPI
export const resetConnection = async (
	clerkId: string
): Promise<{
	success: boolean;
	error?: string;
}> => {
	const response = await fetch("/api/user/reset-connection", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ clerkId }),
	});
	const data = await response.json();
	return data;
};
