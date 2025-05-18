// ログイン入力の型定義
export interface LoginInput {
  email: string;
  password: string;
}

// 認証レスポンスの型定義
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// 新規登録入力の型定義
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
