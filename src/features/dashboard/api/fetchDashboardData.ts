import { DashboardData } from "../types/dashboard.types";

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch("/api/dashboard");
    if (!response.ok) {
      throw new Error("データの取得に失敗しました");
    }
    return await response.json();
  } catch (error) {
    console.error("ダッシュボードデータの取得エラー:", error);
    // エラー時にはモックデータを返すか、エラーを投げる
    throw error;
  }
}
