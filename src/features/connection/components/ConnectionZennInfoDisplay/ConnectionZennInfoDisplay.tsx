import React from "react";
import Image from "next/image";
import styles from "./ConnectionZennInfoDisplay.module.css";

interface UserInfo {
  id: string;
  clerkId: string;
  displayName?: string;
  zennUsername?: string;
  profileImage?: string;
  zennArticleCount: number;
}

interface ConnectionZennInfoDisplayProps {
  userInfo: UserInfo;
  loading: boolean;
}

const ConnectionZennInfoDisplay: React.FC<ConnectionZennInfoDisplayProps> = ({
  userInfo,
  loading,
}) => {
  return (
    <div className={styles["zenn-info-container"]}>
      <div className={styles["zenn-info-content"]}>
        <h2 className={styles["zenn-info-title"]}>Zenn連携情報</h2>
        <div className="grid gap-6 md:gap-3">
          <dl className={styles["user-info-list"]}>
            <dt className={styles["user-info-title"]}>
              <Image
                src="/images/connection/user-icon.svg"
                alt="ユーザーアイコン"
                width={17}
                height={17}
                className={styles["user-info-icon"]}
              />
              <span className={styles["user-info-title-text"]}>
                ユーザー名：
              </span>
            </dt>
            <dd className={styles["user-info-description"]}>
              @{userInfo.zennUsername}
            </dd>
          </dl>

          <dl className={styles["article-count-list"]}>
            <dt className={styles["article-count-title"]}>
              <Image
                src="/images/connection/article.svg"
                alt="記事のアイコン"
                width={17}
                height={17}
                className={styles["article-count-icon"]}
              />
              <span className={styles["article-count-title-text"]}>
                投稿した記事：
              </span>
            </dt>
            <dd className={styles["article-count-description"]}>
              {loading ? "..." : userInfo.zennArticleCount}件
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ConnectionZennInfoDisplay;
