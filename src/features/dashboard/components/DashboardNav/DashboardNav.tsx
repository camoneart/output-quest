"use client";

import styles from "./DashboardNav.module.css";
import * as Dashboard from "@/features/dashboard/components/index";

interface DashboardNavProps {
  isMenuOpen?: boolean;
  toggleMenu?: () => void;
  className?: string;
}

const DashboardNav = ({
  isMenuOpen = false,
  toggleMenu,
  className = "",
}: DashboardNavProps) => {
  return (
    <>
      <aside
        className={`${styles["dashboard-sidebar"]} ${
          isMenuOpen ? styles["open"] : ""
        } ${className}`}
      >
        <h2 className={`${styles["dashboard-sidebar-title"]}`}>メニュー</h2>
        <div className={`${styles["dashboard-sidebar-container"]}`}>
          <nav className={`${styles["dashboard-sidebar-nav"]}`}>
            <ul className={`${styles["dashboard-sidebar-list"]}`}>
              <Dashboard.DashboardNavItems />
            </ul>
          </nav>
        </div>
      </aside>
      {isMenuOpen && toggleMenu && (
        <div className={styles["overlay"]} onClick={toggleMenu}></div>
      )}
    </>
  );
};

export default DashboardNav;
