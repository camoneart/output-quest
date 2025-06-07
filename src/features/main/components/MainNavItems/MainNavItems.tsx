"use client";

import React from "react";
import { navigationItems } from "@/features/navigation/data/navigationItems";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import styles from "./MainNavItems.module.css";
import Image from "next/image";

const MainNavItems = () => {
  const pathname = usePathname();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  // dashboard内（id1~5）のみBGMを適用する関数
  const handleLinkClick = (itemId: number) => {
    // id1~5（dashboard内）のみBGMを再生
    if (itemId >= 1 && itemId <= 5) {
      playClickSound();
    }
    // id6（connection）、id7（about）は無音で遷移
  };

  return (
    <>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.href}>
            {isActive ? (
              <Button
                key={item.href}
                variant="default"
                className={`${styles["main-nav-item"]} ${styles["main-nav-item-active"]}`}
              >
                <div className={`${styles["main-nav-item-not-link"]}`}>
                  <div
                    className={`${styles["main-nav-item-content"]} ${styles["main-nav-item-content-active"]}`}
                  >
                    <Image
                      src={item.icon || "/images/nav-icon/default-icon.svg"}
                      alt={item.alt || item.title}
                      width={item.width || 20}
                      height={item.height || 20}
                      priority={true}
                      className={`${styles["main-nav-item-icon"]}`}
                    />
                    <h3 className={`${styles["main-nav-item-title"]}`}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Button>
            ) : (
              <Button
                key={item.href}
                asChild
                variant="default"
                className={`${styles["main-nav-item"]}`}
              >
                <Link
                  href={item.href}
                  className={`${styles["main-nav-item-link"]}`}
                  onClick={() => handleLinkClick(item.id)}
                >
                  <div className={`${styles["main-nav-item-content"]}`}>
                    <Image
                      src={item.icon || "/images/nav-icon/default-icon.svg"}
                      alt={item.alt || item.title}
                      width={item.width || 20}
                      height={item.height || 20}
                      priority={true}
                      className={`${styles["main-nav-item-icon"]}`}
                    />
                    <h3 className={`${styles["main-nav-item-title"]}`}>
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </Button>
            )}
          </li>
        );
      })}
    </>
  );
};

export default MainNavItems;
