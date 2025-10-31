import { Metadata } from "next";
import { Suspense } from "react";
import { getPageMetadata } from "@/config/metadata";
import styles from "./DashboardPage.module.css";
import DashboardContent from "@/features/dashboard/components/dashboard-content/DashboardContent";
import DashboardSkeleton from "@/features/dashboard/components/dashboard-skeleton/DashboardSkeleton";

export const metadata: Metadata = getPageMetadata("dashboard");

const DashboardPage = () => {
  return (
    <>
      <h1 className={`${styles["dashboard-title"]}`}>ダッシュボード</h1>
      <div className={styles["dashboard-content-wrapper"]}>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </>
  );
};

export default DashboardPage;
