"use client";

import React from "react";
import styles from "./CommonContainer.module.css";
import { usePathname } from "next/navigation";

const CommonContainer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div
      className={`${styles["common-container"]} ${
        isHome ? "" : styles["border"]
      }`}
    >
      {children}
    </div>
  );
};

export default CommonContainer;
