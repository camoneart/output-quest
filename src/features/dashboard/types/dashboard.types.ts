// ダッシュボードで使用する型定義
import { HeroData } from "@/types/hero.types";

export interface PostStat {
  platform: string;
  count: number;
  color: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  platform: string; // "Zenn" のみになりました
  date: string;
  expGained: number;
}

export interface LastItem {
  id: number;
  name: string;
}

export interface DashboardData {
  heroData: HeroData;
  postStats: PostStat[];
  recentActivity: ActivityItem[];
  lastItem: LastItem;
}
