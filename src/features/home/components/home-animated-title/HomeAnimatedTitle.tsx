"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FC } from "react";
import styles from "./HomeAnimatedTitle.module.css";

interface HomeAnimatedTitleProps {
  className?: string;
  delay?: number;
  duration?: number;
  isActive?: boolean;
}

const HomeAnimatedTitle: FC<HomeAnimatedTitleProps> = ({
  className = "",
  delay = 0.2,
  duration = 6,
}) => {
  const [isActive, setIsActive] = useState(false);

  // active-titleクラスをマウント後の4.7秒後に付与
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 4700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className={`${className} ${isActive ? `${styles["active-title"]}` : ""}`}
      initial={{ y: -600 }}
      animate={{ y: 0 }}
      transition={{
        delay: delay,
        duration: duration,
      }}
    >
      <h1 className={`${styles["title"]}`}>
        <div className={`${styles["title-text-box"]}`}>
          <span className={`${styles["title-text"]} ${styles["title-text-1"]}`}>O</span>
          <span className={`${styles["title-text"]} ${styles["title-text-2"]}`}>U</span>
          <span className={`${styles["title-text"]} ${styles["title-text-3"]}`}>T</span>
          <span className={`${styles["title-text"]} ${styles["title-text-4"]}`}>P</span>
          <span className={`${styles["title-text"]} ${styles["title-text-5"]}`}>U</span>
          <span className={`${styles["title-text"]} ${styles["title-text-6"]}`}>T</span>
        </div>
        <div className={`${styles["title-text-box"]}`}>
          <span className={`${styles["title-text"]} ${styles["title-text-7"]}`}>Q</span>
          <span className={`${styles["title-text"]} ${styles["title-text-8"]}`}>U</span>
          <span className={`${styles["title-text"]} ${styles["title-text-9"]}`}>E</span>
          <span className={`${styles["title-text"]} ${styles["title-text-10"]}`}>S</span>
          <span className={`${styles["title-text"]} ${styles["title-text-11"]}`}>T</span>
        </div>
      </h1>
    </motion.div>
  );
};

export default HomeAnimatedTitle;
