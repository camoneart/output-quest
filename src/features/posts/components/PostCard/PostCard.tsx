import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PostCard.module.css";
import { PlatformType } from "@/features/posts/types";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

type PostCardProps = {
  title: string;
  url: string;
  category?: string;
  publishedAt?: string;
  platformType?: PlatformType;
};

const PLATFORM_INFO: Record<PlatformType, { name: string; favicon: string }> = {
  zenn: {
    name: "Zenn",
    favicon: "https://zenn.dev/images/logo-transparent.png",
  },
} as Record<PlatformType, { name: string; favicon: string }>;

// 日付をフォーマットする関数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

// カテゴリー表示用のマッピング
const CATEGORY_DISPLAY = {
  tech: "TECH",
  idea: "IDEA",
};

const PostCard = ({
  title,
  url,
  category,
  publishedAt,
  platformType,
}: PostCardProps) => {
  const platformInfo = platformType ? PLATFORM_INFO[platformType] : null;

  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_decision.mp3",
    volume: 0.5,
  });

  return (
    <article
      className={`${styles["post-card"]} ${
        platformType ? styles[`post-card-${platformType}`] : ""
      }`}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playClickSound()}
        className={`${styles["post-card__link"]}`}
      >
        <h4 className={`${styles["post-card__title"]}`}>{title}</h4>

        <hr />

        {/* 新しいコンテンツ表示エリア */}
        <div className={`${styles["post-card__info"]}`}>
          {/* カテゴリー表示 */}
          {category && (
            <div className={styles["post-card__category-box"]}>
              <span className={`${styles["post-card__category"]}`}>
                {CATEGORY_DISPLAY[category as keyof typeof CATEGORY_DISPLAY] ||
                  category}
              </span>
            </div>
          )}

          {/* 投稿日表示 */}
          {publishedAt && (
            <div className={`${styles["post-card__date-box"]}`}>
              <span className={`${styles["post-card__date"]}`}>
                {formatDate(publishedAt)}
              </span>
            </div>
          )}
        </div>

        <div className={`${styles["post-card__site-name"]}`}>
          {platformInfo && (
            <>
              <Image
                src={platformInfo.favicon}
                alt={`${platformInfo.name} favicon`}
                width={14}
                height={14}
                className={`${styles["favicon"]}`}
              />
              <p className={`${styles["post-card__site-name-text"]}`}>
                {platformInfo.name}
              </p>
            </>
          )}
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
