"use client";

import { siteData } from "@/config/site";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";


export const Footer = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <footer className={`${styles["footer"]}`}>
      <div
        className={`${styles["footer-container"]} ${
          isHome ? styles["home-position"] : styles["other-position"]
        }`}
      >
        <div className={`${styles["footer-box"]}`}>
          <small className={`${styles["footer-text"]} block text-xs font-black`}>
            © 2025 {siteData.siteMainTitle}
          </small>
        </div>
      </div>
    </footer>
  );
};
