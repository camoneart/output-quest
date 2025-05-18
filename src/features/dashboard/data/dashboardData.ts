import { DashboardData } from "../types/dashboard.types";

// 開発用のモックデータ
export const dashboardData: DashboardData = {
  heroData: {
    name: "勇者",
    level: 5,
    currentExp: 450,
    nextLevelExp: 600,
    remainingArticles: 1,
  },

  postStats: [{ platform: "Zenn", count: 0, color: "#3ea8ff" }],

  recentActivity: [
    {
      id: 1,
      title: "Reactのカスタムフックについて",
      platform: "Zenn",
      date: "2025年1月1日",
      expGained: 120,
    },
    {
      id: 2,
      title: "TypeScriptの型推論の仕組み",
      platform: "Zenn",
      date: "2025年1月1日",
      expGained: 100,
    },
    {
      id: 3,
      title: "Next.jsのサーバーサイドレンダリングについて",
      platform: "Zenn",
      date: "2025年1月1日",
      expGained: 100,
    },
    {
      id: 4,
      title: "Reactコンポーネントの最適化",
      platform: "Zenn",
      date: "2025年1月1日",
      expGained: 120,
    },
    {
      id: 5,
      title: "TypeScriptとNext.jsの組み合わせ",
      platform: "Zenn",
      date: "2025年1月1日",
      expGained: 120,
    },
    {
      id: 6,
      title: "Zennでの効果的な技術記事の書き方",
      platform: "Zenn",
      date: "2025年1月1日",
      expGained: 120,
    },
  ],

  lastItem: {
    id: 1,
    name: "鉄の剣、薬草",
  },
};
