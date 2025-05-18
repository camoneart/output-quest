"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import styles from "./HomeStartButton.module.css";

const HomeStartButton = () => {
  const router = useRouter();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/start-sound.mp3",
    volume: 1,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playClickSound();

    setTimeout(() => {
      router.push("/about");
    }, 700);
  };

  return (
    <div className={`${styles["start-btn-container"]}`}>
      <Link
        href="/about"
        className={`${styles["start-btn"]}`}
        onClick={handleClick}
      >
        はじめる
      </Link>
    </div>
  );
};

export default HomeStartButton;
