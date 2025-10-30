import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./DashboardPage.module.css";
import DashboardContent from "@/features/dashboard/components/dashboard-content/DashboardContent";

export const metadata: Metadata = getPageMetadata("dashboard");

const DashboardPage = () => {
  return (
    <>
      <h1 className={`${styles["dashboard-title"]}`}>ダッシュボード</h1>
      <div className={styles["dashboard-content-wrapper"]}>
        <DashboardContent />
      </div>
    </>
  );
};

export default DashboardPage;
