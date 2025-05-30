"use client";

import React from "react";
import styles from "./DashboardHeroSection.module.css";
import Link from "next/link";
import Image from "next/image";
import { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import { useRouter } from "next/navigation";
import { useHero } from "@/contexts/HeroContext";

type DashboardHeroSectionProps = {
  dashboardData: DashboardData;
};

const DashboardHeroSection = ({ dashboardData }: DashboardHeroSectionProps) => {
  const router = useRouter();
  const { heroData, isLoading, error } = useHero();

  // 経験値ゲージを常に40%表示に固定
  const expProgressPercent = isLoading ? 0 : 40;

  // 次のレベルまでの残り記事数は常に1
  const remainingArticles = 1;

  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
    delay: 190, // 190ミリ秒 = 0.19秒の遅延
  });

  // 遅延付きページ遷移の処理
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    playClickSound(() => router.push(path));
  };

  // 表示するレベル値を決定（HeroContextから取得）
  const displayLevel = isLoading
    ? dashboardData.heroData.level
    : heroData.level;

  return (
    <section className={`${styles["hero-info-section"]}`}>
      <h3 className={`${styles["hero-info-title"]}`}>~ 勇者のレベル ~</h3>
      <div className={`${styles["hero-info-container"]}`}>
        {/* キャラクター情報 */}
        <div className={`${styles["hero-info"]}`}>
          <div className={`${styles["hero-info-box"]}`}>
            <div className={`${styles["hero-info-icon-box"]}`}>
              <Link
                href={"/strength/"}
                className={`${styles["hero-info-icon"]}`}
                onClick={(e) => handleNavigation(e, "/strength/")}
              >
                <Image
                  src={`/images/common/character_yusha_01_red.png`}
                  alt={dashboardData.heroData.name}
                  width={55}
                  height={55}
                  priority={true}
                  className={`${styles["hero-info-icon-image"]}`}
                />
              </Link>
            </div>
            <div className={styles["hero-info-name-box"]}>
              <p className={`${styles["hero-info-name"]}`}>
                {dashboardData.heroData.name}
              </p>
            </div>
          </div>
          <div className={`${styles["hero-info-level"]}`}>
            <div className={`${styles["hero-info-level-display-container"]}`}>
              <div className={`${styles["hero-info-level-display-box"]}`}>
                <div className={`${styles["hero-info-level-display"]}`}>
                  <span className={`${styles["hero-info-level-display-text"]}`}>
                    Lv
                  </span>
                  <span
                    className={`${styles["hero-info-level-display-value"]}`}
                  >
                    {isLoading ? (
                      <div className={styles["loading-indicator"]}>...</div>
                    ) : error ? (
                      <div className={styles["loading-indicator"]}>1</div>
                    ) : (
                      displayLevel
                    )}
                  </span>
                </div>
              </div>
            </div>
            {/* レベルアップ情報 */}
            <div className={`${styles["hero-info-level-progress-box"]}`}>
              <div className={`${styles["hero-info-level-progress-text-box"]}`}>
                <span className={`${styles["hero-info-level-progress-text"]}`}>
                  次のレベルまで：
                </span>
                <div
                  className={`${styles["hero-info-level-progress-value-info"]}`}
                >
                  {isLoading ? (
                    <div className={styles["loading-indicator-small"]}>...</div>
                  ) : (
                    <em
                      className={`${styles["hero-info-level-progress-value"]}`}
                    >
                      {remainingArticles}
                    </em>
                  )}
                  <span
                    className={`${styles["hero-info-level-progress-unit"]}`}
                  >
                    記事
                  </span>
                </div>
              </div>
              <div
                className={`${styles["hero-info-level-progress-gauge-box"]}`}
              >
                <div
                  className={`${styles["hero-info-level-progress-gauge"]}`}
                  style={{
                    width: `${expProgressPercent}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHeroSection;
