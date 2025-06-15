import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

// リクエストボディのバリデーション
const analyzeRequestSchema = z.object({
	articles: z.array(
		z.object({
			title: z.string(),
			url: z.string(),
			category: z.string(),
			publishedAt: z.string(),
			emoji: z.string().optional(),
		})
	),
	username: z.string(),
});

export async function POST(request: NextRequest) {
	try {
		// 認証チェック
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		// APIキーの確認
		const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
		if (!apiKey) {
			console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
			return NextResponse.json(
				{
					error:
						"AI機能が利用できません。環境変数：GOOGLE_GENERATIVE_AI_API_KEYを設定してください。",
				},
				{ status: 500 }
			);
		}

		// リクエストボディの解析とバリデーション
		const body = await request.json();
		const validatedData = analyzeRequestSchema.parse(body);
		const { articles, username } = validatedData;

		if (articles.length === 0) {
			return NextResponse.json(
				{ error: "探索する記事がありません" },
				{ status: 400 }
			);
		}

		// 記事データを整理
		const articlesText = articles
			.map(
				(article, index) =>
					`${index + 1}. タイトル: ${article.title}
				カテゴリ: ${article.category}
				公開日: ${article.publishedAt}
				URL: ${article.url}`
			)
			.join("\n\n");

		// AIへのプロンプト作成
		const prompt = `あなたは技術記事の探索とコンテンツ提案の専門家です。

以下は@${username}さんがZennで投稿した記事一覧です：

${articlesText}

これらの記事を全て探索して、以下の観点から詳細な探索結果と次の記事テーマの提案をしてください：

## 📊 記事傾向の探索
1. **技術分野の傾向**: どのような技術領域に興味を持っているか
2. **記事の特徴**: タイトルの傾向、扱うトピックの深さ
3. **成長の軌跡**: 時系列での技術的な成長や興味の変化

## 💡 次の記事テーマ提案（5つ）
過去の記事傾向を踏まえ、以下の条件で記事テーマを提案してください：
- 既存の知識を活かせるもの
- 少し挑戦的で成長につながるもの
- 読者にとって価値のあるもの
- 具体的で実装可能なもの

各提案には以下を含めてください：
- **タイトル案**
- **概要**（どんな内容を書くか）
- **想定読者**
- **なぜこのテーマがおすすめか**

## 🎯 学習・成長のアドバイス
今後の技術的な成長のために、どのような分野を学習すると良いかアドバイスをください。

探索結果は読みやすく、具体的で実用的な内容にしてください。必ず最後まで完全な回答を提供してください。`;

		// Vercel AI SDKを使用してストリーミングレスポンスを生成
		const result = await streamText({
			model: google("gemini-2.5-flash-preview-05-20", {
				safetySettings: [
					{
						category: "HARM_CATEGORY_HATE_SPEECH",
						threshold: "BLOCK_MEDIUM_AND_ABOVE",
					},
					{
						category: "HARM_CATEGORY_DANGEROUS_CONTENT",
						threshold: "BLOCK_MEDIUM_AND_ABOVE",
					},
					{
						category: "HARM_CATEGORY_HARASSMENT",
						threshold: "BLOCK_MEDIUM_AND_ABOVE",
					},
					{
						category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
						threshold: "BLOCK_MEDIUM_AND_ABOVE",
					},
				],
			}),
			prompt,
			temperature: 0.7,
			maxTokens: 10000,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("AI探索エラー:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "リクエストデータが無効です", details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "記事探索中にエラーが発生しました" },
			{ status: 500 }
		);
	}
}
