"use client";

import React from "react";
import styles from "./AboutLink.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { useAuth } from "@clerk/nextjs";

const AboutLink = () => {
  const router = useRouter();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });
  const { userId, isLoaded } = useAuth();
  const [isZennLinked, setIsZennLinked] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setIsZennLinked(false);
      return;
    }
    (async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setIsZennLinked(data.success && !!data.user?.zennUsername);
      } catch (err) {
        console.error("Zenn連携情報の取得に失敗しました", err);
        setIsZennLinked(false);
      }
    })();
  }, [isLoaded, userId]);

  if (!isLoaded || isZennLinked === null) {
    return (
      <div className={`${styles["about-link-box"]}`}>
        <span className={`${styles["about-link-text"]}`}>読み込み中...</span>
      </div>
    );
  }

  const canAdventure = Boolean(userId && isZennLinked);
  const targetPath = canAdventure ? "/dashboard" : "/connection";
  const linkText = canAdventure
    ? "冒険をはじめる"
    : "Zennと連携して冒険をはじめる";

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  return (
    <div className={`${styles["about-link-box"]}`}>
      <Link
        href={targetPath}
        className={`${styles["about-link"]}`}
        onClick={(e) => handleNavigation(e, targetPath)}
      >
        <Image
          src="/images/arrow/arrow-icon.svg"
          alt={linkText}
          width={20}
          height={20}
          className={styles["about-link-icon"]}
        />
        <span className={styles["about-link-text"]}>{linkText}</span>
      </Link>
    </div>
  );
};

export default AboutLink;
