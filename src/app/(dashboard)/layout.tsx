import * as Dashboard from "@/features/dashboard/components/index";
import styles from "./DashboardLayout.module.css";
import { EquipmentProvider } from "@/features/equipment/contexts/EquipmentContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EquipmentProvider>
      <Dashboard.DashboardContainer>
        <div className={`grid md:grid-cols-[250px_1fr] ${styles["container"]}`}>
          <Dashboard.DashboardNav />
          <main className={`${styles["main"]}`}>
            <div className={`${styles["content"]}`}>{children}</div>
          </main>
        </div>
      </Dashboard.DashboardContainer>
    </EquipmentProvider>
  );
}
