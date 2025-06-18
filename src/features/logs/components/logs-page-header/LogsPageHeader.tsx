import React from "react";
import styles from "./LogsPageHeader.module.css";
const LogsPageHeader = () => {
  return (
    <div className={styles["logs-page-header"]}>
      <p className={styles["logs-page-header-text"]}>
        このページでは、過去の冒険ログを確認できます。
      </p>
    </div>
  );
};

export default LogsPageHeader;
