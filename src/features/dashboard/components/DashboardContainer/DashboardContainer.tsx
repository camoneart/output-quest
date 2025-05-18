import React from 'react'
import styles from "./DashboardContainer.module.css";

const DashboardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${styles["dashboard-container"]}`}>
      {children}
    </div>
  )
}

export default DashboardContainer;