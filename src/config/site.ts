export const siteData = {
  siteMainTitle: "OUTPUT QUEST",
  siteSubtitle: "~ 叡智の継承者 ~",
  siteFullTitle: "OUTPUT QUEST ~ 叡智の継承者 ~",
  siteDescription:
    "OUTPUT QUESTは、RPG風のゲーミフィケーションを取り入れた学習支援アプリです。Zennで記事を書き、勇者を育てる新感覚の学びの冒険を、いま始めよう！",
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://outputquest.com",
  author: "aoyama",
  copyright: "© 2025 OUTPUT QUEST",
};

export const openGraphImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: siteData.siteFullTitle,
};
