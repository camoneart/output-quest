import { Metadata } from "next";
import { siteData, openGraphImage } from "../config/site";

// 全ページ共通のメタデータ
export const baseMetadata: Metadata = {
	title: {
		default: siteData.siteFullTitle,
		template: `%s｜${siteData.siteMainTitle}`,
	},
	description: siteData.siteDescription,
	authors: [{ name: "aoyama" }],
	generator: "Next.js",
	robots: {
		index: false,
		follow: false,
	},
	metadataBase: new URL(siteData.siteUrl),
	// OGP設定
	openGraph: {
		type: "website",
		locale: "ja_JP",
		url: siteData.siteUrl,
		siteName: siteData.siteFullTitle,
		title: siteData.siteFullTitle,
		description: siteData.siteDescription,
		images: [
			{
				url: openGraphImage.url,
				width: openGraphImage.width,
				height: openGraphImage.height,
				alt: openGraphImage.alt,
			},
		],
	},
};

// 各ページごとのメタデータ設定
export const metadata: Record<string, Metadata> = {
	dashboard: {
		...baseMetadata,
		title: "ダッシュボード",
		description:
			"勇者の冒険の拠点。進捗状況や最新の活動履歴をひと目で確認できます。",
	},
	posts: {
		...baseMetadata,
		title: "投稿一覧",
		description: "勇者の学びの記録を振り返ることができます。",
	},
	strength: {
		...baseMetadata,
		title: "つよさ",
		description:
			"勇者の成長を数値化。蓄積された経験と次のレベルへの道のりを視覚的に確認できます。",
	},
	title: {
		...baseMetadata,
		title: "称号リスト",
		description: "獲得した称号、未獲得の称号を一覧で確認できます。",
	},
	equipment: {
		...baseMetadata,
		title: "そうび一覧",
		description: "勇者の装備アイテムを一覧で確認できます。",
	},
	logs: {
		...baseMetadata,
		title: "冒険ログ",
		description: "過去の冒険ログを一覧で確認できます。",
	},
	party: {
		...baseMetadata,
		title: "なかま",
		description: "勇者のなかまとなったキャラクターを一覧で確認できます。",
	},
	items: {
		...baseMetadata,
		title: "アイテム",
		description: "勇者が冒険で手に入れたアイテムを一覧で確認できます。",
	},
	connection: {
		...baseMetadata,
		title: "連携",
		description: "ログイン/新規登録、Zennのアカウント連携を管理できます。",
	},
	connectionDetail: {
		...baseMetadata,
		title: "Zennとの連携について",
		description: "OUTPUT QUESTとZennアカウントを連携させることで得られるメリットや、ゲストとしてアプリを手軽に体験する方法について解説します。あなたに合った方法で、OUTPUT QUESTの世界を冒険しましょう。",
	},
	about: {
		...baseMetadata,
		title: "OUTPUT QUESTとは ?",
		description:
			"OUTPUT QUESTの世界観と使い方。アウトプットを通じて成長する新感覚の冒険の始め方を解説します。",
	},
	terms: {
		...baseMetadata,
		title: "利用規約",
		description: "OUTPUT QUESTの利用規約です。",
	},
	privacy: {
		...baseMetadata,
		title: "プライバシーポリシー",
		description: "OUTPUT QUESTのプライバシーポリシーです。",
	},
};

// 特定ページのメタデータを取得するヘルパー関数
export const getPageMetadata = (pageName: keyof typeof metadata): Metadata => {
	return metadata[pageName] || baseMetadata;
};
