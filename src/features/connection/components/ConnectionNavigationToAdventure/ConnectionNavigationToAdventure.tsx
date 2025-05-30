import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ConnectionNavigationToAdventure.module.css";

interface ConnectionNavigationToAdventureProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
}

const ConnectionNavigationToAdventure: React.FC<ConnectionNavigationToAdventureProps> = ({
  onNavigate,
}) => {
  return (
    <div className={styles["back-to-dashboard-link-container"]}>
      <div className={styles["back-to-dashboard-link-box"]}>
        <Link
          href="/dashboard"
          className={`${styles["back-to-dashboard-link"]}`}
          onClick={(e) => onNavigate(e, "/dashboard")}
        >
          <Image
            src="/images/arrow/arrow-icon.svg"
            alt="冒険をはじめる"
            width={17}
            height={17}
            className={styles["back-to-dashboard-link-icon"]}
          />
          <span className={styles["back-to-dashboard-link-text"]}>
            冒険をはじめる
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ConnectionNavigationToAdventure;
