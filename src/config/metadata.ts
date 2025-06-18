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
			"勇者の冒険の拠点。勇者の成長度合いを示すレベル、Zennでの投稿数、勇者の仲間に加わったキャラや入手したアイテムを確認できます。",
	},
	posts: {
		...baseMetadata,
		title: "学びの書",
		description: "Zennの記事を「これまでの学び」として記録する場所。Zennで投稿した記事が一覧表示され、学びの記録として振り返ることができます。",
	},
	explore: {
		...baseMetadata,
		title: "記事探索",
		description: "AIが勇者の仲間の「賢者」として、次に書く記事に最適なテーマを提案。賢者（AI）は、あなたのZenn記事を探索し、過去の投稿から傾向を探ることで、あなたの成長に最適な「学びのタネ」を見つけ出します。",
	},
	strength: {
		...baseMetadata,
		title: "つよさ",
		description:
			"勇者の成長度合いを示すレベル、レベルアップ報酬で獲得した「称号」の確認、勇者の「装備アイテム」の確認、学びの記録を時系列で確認できる「冒険ログ」の確認ができます。",
	},
	title: {
		...baseMetadata,
		title: "称号リスト",
		description: "勇者がレベルアップ報酬で獲得した称号を一覧で確認できます。",
	},
	equipment: {
		...baseMetadata,
		title: "そうび一覧",
		description: "勇者の装備アイテムを一覧で確認できます。",
	},
	logs: {
		...baseMetadata,
		title: "冒険ログ",
		description: "学びの軌跡が残る「冒険ログ」。これまでの学びの軌跡を時系列で確認できます。",
	},
	party: {
		...baseMetadata,
		title: "なかま",
		description: "勇者の仲間に加わったキャラクターを確認できます。1人1人のキャラクターの詳細情報も確認できます。",
	},
	items: {
		...baseMetadata,
		title: "アイテム",
		description: "勇者がレベルアップ報酬で入手したアイテムを確認できます。1つ1つのアイテムの詳細情報も確認できます。",
	},
	connection: {
		...baseMetadata,
		title: "連携",
		description: "Clerk認証によるログイン/新規登録、Zennのアカウント連携を管理できます。ログインとZenn連携をすることで、Zennの投稿データがアプリ内のUIに反映されます。アプリは「ログイン」「新規登録」無しでも利用できます。",
	},
	connectionDetail: {
		...baseMetadata,
		title: "Zennとの連携について",
		description: "OUTPUT QUESTとZennアカウントを連携させることで得られるメリットや、ゲストユーザーとしてアプリを手軽に体験する方法について解説します。あなたに合った方法で、OUTPUT QUESTの世界を体験できます。",
	},
	about: {
		...baseMetadata,
		title: "OUTPUT QUESTとは ?",
		description:
			"OUTPUT QUESTの世界観と使い方、アウトプットを通じて成長する「新感覚学習RPG」の始め方を解説します。アプリの概要、コンセプト、主要機能について紹介します。",
	},
	terms: {
		...baseMetadata,
		title: "利用規約",
		description: "OUTPUT QUESTの利用規約を確認できます。",
	},
	privacy: {
		...baseMetadata,
		title: "プライバシーポリシー",
		description: "OUTPUT QUESTのプライバシーポリシーを確認できます。",
	},
};

// 特定ページのメタデータを取得するヘルパー関数
export const getPageMetadata = (pageName: keyof typeof metadata): Metadata => {
	return metadata[pageName] || baseMetadata;
};
