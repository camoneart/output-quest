import { PostData } from "../types";

// APIから記事データを取得する関数
export const fetchZennArticles = async (
  username: string = "aoyamadev",
  options: {
    limit?: number;
    fetchAll?: boolean; // 全件取得フラグを追加
  } = {}
): Promise<PostData[]> => {
  try {
    // 全件取得の場合はlimitパラメータを送信しない
    const params = new URLSearchParams({
      username: encodeURIComponent(username),
    });

    // 全件取得でない場合、かつlimit値が指定されている場合のみ追加
    if (!options.fetchAll && options.limit !== undefined && options.limit > 0) {
      params.append("limit", options.limit.toString());
    }

    // サーバーサイドレンダリング時にも動作するよう、絶対URLを構築
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const apiUrl = `${baseUrl}/api/zenn?${params.toString()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // 60秒ごとにキャッシュを再検証（ISR）
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Unknown error");
    }

    return data.articles;
  } catch (error) {
    console.error("Zenn記事の取得に失敗しました:", error);
    throw error; // エラーを再スローしてSuspenseで捕捉できるようにする
  }
};
