import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./LogsPage.module.css";
import * as Logs from "@/features/logs/components/index";

export const metadata: Metadata = getPageMetadata("logs");

const LogsPage = () => {
  return (
    <>
      <h1 className={styles["logs-page-title"]}>冒険ログ</h1>
      <div className={styles["logs-page-container"]}>
        <Logs.LogsPageHeader />

        <hr className={styles["logs-page-line-first"]} />

        <Logs.LogsList />

        <hr className={styles["logs-page-line-second"]} />

        <Logs.LogsPageFooter />
      </div>
    </>
  );
};

export default LogsPage;
