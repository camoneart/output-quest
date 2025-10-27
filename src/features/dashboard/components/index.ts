import DashboardHeroSection from "./dashboard-hero-section/DashboardHeroSection";
import DashboardPlatformStatsSection from "./dashboard-platform-stats-section/DashboardPlatformStatsSection";
import DashboardLatestItemSection from "./dashboard-latest-item-section/DashboardLatestItemSection";
import DashboardLatestPartyMemberSection from "./dashboard-latest-party-member-section/DashboardLatestPartyMemberSection";

// ❌ Server Componentsは削除
// DashboardActivitySection → Server Component（Compositionパターンで使用）
// DashboardContent → Server Component（直接importして使用）

export {
  DashboardHeroSection,
  DashboardPlatformStatsSection,
  DashboardLatestItemSection,
  DashboardLatestPartyMemberSection,
};
