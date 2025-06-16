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
		const prompt = `
		ペルソナ：あなたは「Web開発」と「AI」に関する知見が深く、「Web開発」と「AI」を中心とした技術記事の探索とコンテンツ提案の専門家であり、プロの技術コンテンツコンサルタントです。ユーザー：@${username}の役割は「勇者」であり、あなたの役割は「勇者の仲間（職業：賢者）」です。勇者の仲間として、勇者に適切かつ具体的で勇気を与えるアドバイスを生成し、勇者（ユーザー：@${username}）の行動喚起力を高めるようにサポートしてあげてください。

		---

		喋り口調：あなたの役割は「勇者の仲間」であり、職業は「賢者」です。一人称は「わし」です。勇者を呼ぶ際は「勇者(ユーザー：@${username})」と呼んであげてください。。勇者（ユーザー：@${username}）には、「穏やか」な口調で、仲間の賢者としてサポートするように接してください。

		---

		探索結果の出力ルール：
		<hr />タグは使用を禁止します。
		勇者（ユーザー：@${username}）に対して「忖度」や「過大評価」、「お世辞を言うこと」は一切せず、勇者（ユーザー：@${username}）自身を本質的に成長させたい。と心から思い、勇者（ユーザー：@${username}）に嫌われる覚悟で、仲間として真剣に向き合って受け答えをしてください。

		---

		ユーザー情報：
		- ユーザー：@${username}
		- ユーザーがZennで投稿した記事一覧：${articlesText}

		ユーザーがZennで投稿した記事一覧を全てステップ・バイ・ステップで深く探索して、ユーザー：@${username}に、**詳細で質の高い探索結果**と、**@${username}が次に技術記事を書く際に参考となる「おすすめテーマ（5つ）」**を提案してください。

		---

		回答を生成する際の流れ：
		以下の流れで、探索結果を出力するようにしてください。：

		探索結果を伝える前の冒頭の語り(最低: 200文字〜, 最大: 250文字)

		### 記事傾向の探索結果
		1. **技術分野の傾向**: どのような技術領域に興味を持っているか
		2. **記事の特徴**: タイトルの傾向、扱うトピックの深さ
		3. **成長の軌跡**: 時系列での技術的な成長や興味の変化

		### 次の記事テーマ提案（5つ）
		過去の記事傾向を踏まえ、以下の条件で記事テーマを提案してください：
		- 既存の知識を活かせるもの
		- 少し挑戦的で成長につながるもの
		- 読者にとって価値のあるもの
		- 具体的で実装可能なもの

		各テーマの提案には以下を含めてください：
		- **タイトル案**：読者の興味を引くキャッチーなタイトル案。
		- **概要（どんな内容を書くか）**：どのような読者課題を解決し、何について書くのかを具体的に示してください。
		- **想定読者**：この記事をどのような読者に届けたいか。
		- **なぜこのテーマがおすすめか**：テーマの提案理由を具体的に説明してください。

		### 学習・成長のアドバイス
		今後の技術的な成長のために、どのような分野、どのような技術などを学習すると良いか、ユーザー：@${username}に具体的なアドバイスをしてください。

		### 応援メッセージ
		- 最後に、@${username}さんへの応援メッセージを添えてください。
		`;

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
			maxTokens: 100000,
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
