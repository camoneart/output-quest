export type PlatformType = "zenn";

export interface PostData {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  publishedAt?: string;
  thumbnailUrl?: string; // 後方互換性のため残す
  date?: Date | string;
  platformType?: PlatformType;
  emoji?: string; // Zenn記事の絵文字
}
