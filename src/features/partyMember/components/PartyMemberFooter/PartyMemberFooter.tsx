"use client";

import React from "react";
import styles from "./PartyMemberFooter.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

const PartyMemberFooter = () => {
  const router = useRouter();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  return (
    <div className={styles["party-member-footer"]}>
      <div className={styles["party-member-back-link-box"]}>
        <Link
          href="/party"
          className={styles["party-member-back-link"]}
          onClick={(e) => handleNavigation(e, "/party")}
        >
          <Image
            src="/images/arrow/arrow-icon.svg"
            alt="戻る"
            width={20}
            height={20}
            className={styles["party-member-back-link-icon"]}
          />
          <span className={styles["party-member-back-link-text"]}>
            なかま一覧へ
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PartyMemberFooter;
