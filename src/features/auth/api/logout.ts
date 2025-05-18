export const logout = (): void => {
  // ローカルストレージからトークンを削除
  localStorage.removeItem("token");

  // 必要に応じて他の認証情報もクリア
  // localStorage.removeItem('user');

  // ホームページにリダイレクト
  window.location.href = "/";
};
