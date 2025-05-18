// ステータスの定義
export const USER_STATUS = {
  BEGINNER: {
    name: "初心者",
    minArticles: 0,
    maxArticles: 0,
    level: 1,
  },
  CONTRIBUTOR: {
    name: "貢献者",
    minArticles: 1,
    maxArticles: 5,
    level: 2,
  },
  WRITER: {
    name: "ライター",
    minArticles: 6,
    maxArticles: 10,
    level: 3,
  },
  AUTHOR: {
    name: "著者",
    minArticles: 11,
    maxArticles: 20,
    level: 4,
  },
  EXPERT: {
    name: "エキスパート",
    minArticles: 21,
    maxArticles: 50,
    level: 5,
  },
  MASTER: {
    name: "マスター",
    minArticles: 51,
    maxArticles: Infinity,
    level: 6,
  },
};

type StatusKey = keyof typeof USER_STATUS;

/**
 * 記事数に基づいてユーザーステータスを取得
 * @param articleCount Zenn記事数
 * @returns {Object} ステータス情報
 */
export const getUserStatus = (articleCount: number) => {
  let status: StatusKey = "BEGINNER";

  // 記事数に応じてステータスを判定
  for (const [key, value] of Object.entries(USER_STATUS)) {
    if (
      articleCount >= value.minArticles &&
      articleCount <= value.maxArticles
    ) {
      status = key as StatusKey;
      break;
    }
  }

  return {
    statusKey: status,
    statusName: USER_STATUS[status].name,
    level: USER_STATUS[status].level,
  };
};

/**
 * 次のレベルに必要な記事数を計算
 * @param currentArticleCount 現在の記事数
 * @returns {Object} 次のレベル情報
 */
export const getNextLevelInfo = (currentArticleCount: number) => {
  const currentStatus = getUserStatus(currentArticleCount);
  const statusKeys = Object.keys(USER_STATUS) as StatusKey[];
  const currentIndex = statusKeys.indexOf(currentStatus.statusKey);

  // 既に最高レベルの場合
  if (currentIndex === statusKeys.length - 1) {
    return {
      nextLevel: null,
      nextLevelName: null,
      articlesNeeded: 0,
      isMaxLevel: true,
    };
  }

  const nextStatusKey = statusKeys[currentIndex + 1];
  const nextStatus = USER_STATUS[nextStatusKey];
  const articlesNeeded = nextStatus.minArticles - currentArticleCount;

  return {
    nextLevel: nextStatus.level,
    nextLevelName: nextStatus.name,
    articlesNeeded,
    isMaxLevel: false,
  };
};
