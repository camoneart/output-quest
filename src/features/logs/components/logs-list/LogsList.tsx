"use client";

import React, { useEffect, useState } from "react";
import styles from "./LogsList.module.css";

const LOGS_STORAGE_KEY = "adventure_logs";

const LogsList = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ローカルストレージからログを取得
    const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    if (savedLogs) {
      // 取得した文字列を配列に変換
      setLogs(JSON.parse(savedLogs));
    }
    setLoading(false);
  }, []);

  return (
    <ul className={styles["logs-page-list"]}>
      {loading ? (
        <li className={styles["logs-page-list-item"]}>
          <p className={styles["logs-page-list-item-loading-text"]}>読み込み中...</p>
        </li>
      ) : logs.length === 0 ? (
        <li className={styles["logs-page-list-item"]}>
          <p className={styles["logs-page-list-item-text"]}>
            まだ冒険ログがありません。
          </p>
        </li>
      ) : (
        logs.map((log, index) => (
          <li key={index} className={styles["logs-page-list-item"]}>
            <p className={styles["logs-page-list-item-text"]}>{log}</p>
          </li>
        ))
      )}
    </ul>
  );
};

export default LogsList;
