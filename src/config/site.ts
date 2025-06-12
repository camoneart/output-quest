export const siteData = {
  siteMainTitle: "OUTPUT QUEST",
  siteSubtitle: "~ 叡智の継承者 ~",
  siteFullTitle: "OUTPUT QUEST　~ 叡智の継承者 ~",
  siteDescription:
    "OUTPUT QUEST　~ 叡智の継承者 ~ は、RPG風のゲーミフィケーションを取り入れた「新感覚学習RPG」です。Zennで記事を書き、勇者を育てる学びの冒険を いま、始めよう！",
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
