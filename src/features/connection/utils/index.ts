// ユーザー名が有効な形式かチェックする関数
export const isValidZennUsernameFormat = (username: string): boolean => {
	// Zennのユーザー名に使える文字は英数字、アンダースコア、ハイフンのみ
	return /^[a-zA-Z0-9_-]+$/.test(username);
};

// ユーザー名から@を取り除く
export const cleanUsername = (username: string): string => {
	return username.replace(/^@/, "");
};
