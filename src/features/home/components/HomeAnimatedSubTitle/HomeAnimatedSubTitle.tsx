"use client";

import React from "react";
import styles from "./HomeAnimatedSubTitle.module.css";
import { useState, useEffect } from "react";

const HomeAnimatedSubTitle = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 8200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h2
      className={`${styles["subtitle"]} ${
        isActive ? styles["active-subtitle"] : ""
      }`}
    >
      <span className={styles["subtitle-text"]}>~</span>
      叡智の継承者
      <span className={styles["subtitle-text"]}>~</span>
    </h2>
  );
};

export default HomeAnimatedSubTitle;
