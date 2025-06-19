# OUTPUT QUEST　叡智の継承者

![トップページ](/public/gif/README/top-page.gif)

アプリは以下からアクセスできます。

https://outputquest.com

## 目次

- [音声解説](#audio-guide)
- [開発構成図](#development-configuration-diagram)
- [使用技術](#technology-used)
- [ディレクトリ構造](#directory-design)
- [環境構築の手順](#environment-setup-procedure)
- [プロジェクト概要](#project-overview)
- [機能紹介](#feature-introduction)
- [今後追加予定の機能](#future-features)
- [アプリの利用方法](#how-to-use)

<h2 id="audio-guide">音声解説</h2>

アプリの概要や使い方について、音声で解説します。

[【音声解説】OUTPUT QUEST　叡智の継承者](https://notebooklm.google.com/notebook/92b2aa2d-41cb-4635-bebd-7386e35560f5/audio)

<h2 id="development-configuration-diagram">開発構成図</h2>

開発構成図を、HTMLインフォグラフィックで表現しました。

[開発構成図（HTMLインフォグラフィック）](https://aoyamadev.github.io/output-quest-development-configuration-diagram/)

<h2 id="technology-used">使用技術</h2>

<img src="https://img.shields.io/badge/-node.js-444.svg?logo=node.js&style=for-the-badge"> <img src="https://img.shields.io/badge/-next.js-444.svg?logo=next.js&style=for-the-badge"> <img src="https://img.shields.io/badge/-react-444.svg?logo=react&style=for-the-badge"> <img src="https://img.shields.io/badge/-typescript-444.svg?logo=typescript&style=for-the-badge"> <img src="https://img.shields.io/badge/-tailwindcss-444.svg?logo=tailwindcss&style=for-the-badge"> <img src="https://img.shields.io/badge/-shadcn/ui-444.svg?logo=shadcn/ui&style=for-the-badge">
<img src="https://img.shields.io/badge/-motion-444.svg?logo=motion&style=for-the-badge"> <img src="https://img.shields.io/badge/-howler.js-444.svg?logo=howler.js&style=for-the-badge"> <img src="https://img.shields.io/badge/-clerk-444.svg?logo=clerk&style=for-the-badge"> <img src="https://img.shields.io/badge/-prisma-444.svg?logo=prisma&style=for-the-badge"> <img src="https://img.shields.io/badge/-supabase-444.svg?logo=supabase&style=for-the-badge"> <img src="https://img.shields.io/badge/-zod-444.svg?logo=zod&style=for-the-badge"> <img src="https://img.shields.io/badge/-LLM-444.svg?logo=llm&style=for-the-badge"> <img src="https://img.shields.io/badge/-react%20markdown-444.svg?logo=react%20markdown&style=for-the-badge">

### nodeバージョン

- node v22.14.0
- pnpm v10.11.1

### フロント

- [Next.js](https://nextjs.org/blog/next-15-3)：v15.3.1
- [React](https://ja.react.dev/blog/2024/12/05/react-19)：v19.0.0
- [TypeScript](https://www.typescriptlang.org/)：v5

### スタイル・UI

- [Tailwind CSS](https://tailwindcss.com/)：v4.1.8
- [shadcn/ui](https://ui.shadcn.com/)

### アニメーション

- [Motion](https://motion.dev/)：v12.4.7

### オーディオ

- [Howler.js](https://howlerjs.com/)：v2.2.4

### 認証・データベース

- [Clerk](https://clerk.com/)：v6.12.0（認証）
- [Prisma](https://www.prisma.io/)：v6.8.2（ORM）
- [Supabase](https://supabase.com/)（PostgreSQL）

### スキーマバリデーション

- [zod](https://zod.dev/)：v3.25.67

### AI
- [Vercel AI SDK](https://ai-sdk.dev/)：v4.3.16（TypeScript Toolkit）
- [AI SDK Core](https://ai-sdk.dev/docs/ai-sdk-core/overview)：v1.2.19（LLM：Gemini）
- [AI SDK UI](https://ai-sdk.dev/docs/ai-sdk-ui/overview)：v1.2.12（UI）

### Markdown
- [react-markdown](https://github.com/remarkjs/react-markdown)：v10.1.0

### ホスティング

- [Vercel](https://vercel.com/)

<h2 id="directory-design">ディレクトリ構造</h2>

```
outputquest/
├── .next/                                           # Next.jsビルド・キャッシュファイル
├── prisma/                                          # データベース関連ファイル
│   └── migrations/                                  # マイグレーションファイル
├── public/                                          # 静的ファイル
│   ├── audio/                                       # 音声ファイル
│   ├── gif/                                         # アニメーション画像ファイル
│   └── images/                                      # 画像ファイル
│       ├── arrow/                                   # 矢印画像
│       ├── common/                                  # 共通画像
│       ├── connection/                              # Zenn連携情報用画像
│       ├── home-character-icon/                     # トップページのキャラクターアイコン
│       ├── icon/                                    # アイコン類
│       ├── items-page/                              # アイテムページ用画像
│       ├── nav-icon/                                # ナビゲーションアイコン
│       ├── opengraph/                               # OGP用画像
│       ├── party-page/                              # なかまページ用画像
│       └── sns/                                     # SNSアイコン用画像
├── src/
│   ├── app/                                         # ルートディレクトリ（ルーティング管理）
│   │   ├── (main)/                                  # メイン（Route Groups）
│   │   │   ├── about/                               # アバウトページ
│   │   │   ├── connection/                          # Clerk認証・Zenn連携ページ
│   │   │   ├── connection-detail/                   # Clerk認証・Zenn連携の解説ページ
│   │   │   ├── dashboard/                           # ダッシュボードページ
│   │   │   ├── equipment/[equipmentSlug]/           # 装備ページ
│   │   │   ├── explore/                             # 記事探索ページ
│   │   │   ├── items/                               # アイテムページ
│   │   │   ├── logs/                                # ログページ
│   │   │   ├── party/                               # なかまページ
│   │   │   ├── posts/                               # 投稿ページ
│   │   │   ├── privacy/                             # プライバシーポリシーページ
│   │   │   ├── strength/                            # つよさページ
│   │   │   ├── terms/                               # 利用規約ページ
│   │   │   ├── title/                               # 称号ページ
│   │   │   ├── AboutLayout.module.css               # アバウトページ（Route Groups）用CSS Modules
│   │   │   └── layout.tsx                           # アバウトページ（Route Groups）用レイアウトコンポーネント
│   │   ├── api/                                     # API Routes
│   │   │   ├── ai/                                  # AI(LLM)関連API
│   │   │   ├── user/                                # ユーザー関連API
│   │   │   ├── webhooks/                            # Webhook
│   │   │   └── zenn/                                # Zenn連携API
│   │   ├── favicon.ico                              # ファビコン
│   │   ├── Home.module.css                          # トップページ用CSS Modules
│   │   ├── layout.tsx                               # アプリケーション全体のルートレイアウトコンポーネント
│   │   ├── page.tsx                                 # ルートページ（トップページ）
│   │   ├── robots.ts                                # 検索エンジン向けrobots.txt生成
│   │   └── sitemap.ts                               # サイトマップ生成ファイル
│   ├── components/                                  # 再利用可能なUIコンポーネント
│   │   ├── auth/                                    # 認証関連コンポーネント
│   │   ├── common/                                  # 共通コンポーネント
│   │   ├── elements/                                # 基本的なUI要素
│   │   ├── layout/                                  # レイアウトコンポーネント
│   │   └── ui/                                      # shadcn/ui コンポーネント
│   ├── config/                                      # 設定ファイル・定数定義
│   ├── contexts/                                    # React Context・グローバル状態管理
│   ├── features/                                    # componentsでは共通化が難しい、特定の機能やドメイン固有のコンポーネントを管理するディレクトリ
│   │   ├── connection/                              # Clerk認証・Zenn連携ページ機能
│   │   ├── connection-detail/                       # Clerk認証・Zenn連携の解説ページ機能
│   │   ├── dashboard/                               # ダッシュボード機能
│   │   ├── equipment/                               # 装備機能
│   │   ├── equipment-detail/                        # 装備詳細機能
│   │   ├── explore/                                 # 記事探索ページ機能
│   │   ├── gnav/                                    # グローバルナビゲーション機能
│   │   ├── home/                                    # ホームページ機能
│   │   ├── home/                                    # ホームページ機能
│   │   ├── item-detail/                             # アイテム詳細機能
│   │   ├── items/                                   # アイテム機能
│   │   ├── logs/                                    # ログ機能
│   │   ├── main/                                    # メイン機能
│   │   ├── navigation/                              # ナビゲーション機能
│   │   ├── party/                                   # なかま機能
│   │   ├── party-member/                            # なかま詳細機能
│   │   ├── posts/                                   # 投稿機能
│   │   ├── strength/                                # つよさ機能
│   │   └── title/                                   # 称号機能
│   ├── generated/                                   # Prisma Clientなど自動生成されるファイル
│   ├── hooks/                                       # カスタムフック
│   ├── lib/                                         # ライブラリ・ユーティリティ
│   ├── shared/                                      # 共有データ
│   ├── styles/                                      # スタイルファイル
│   ├── types/                                       # TypeScript型定義
│   ├── utils/                                       # ユーティリティ関数
│   └── middleware.ts                                # ミドルウェア
├── .env                                             # 環境変数の設定ファイル
├── .env.example                                     # 環境変数のテンプレートファイル
├── .gitignore                                       # GitHubの差分に含まないものを格納
├── .npmrc                                           # pnpmの設定ファイル
├── .prettierrc.json                                 # Prettierの設定ファイル
├── components.json                                  # shadcn/ui設定ファイル
├── eslint.config.mjs                                # ESLint設定ファイル
├── next.config.ts                                   # Next.js設定ファイル
├── package.json                                     # プロジェクトの依存関係・スクリプト定義
├── pnpm-lock.yaml                                   # pnpmの依存関係ロックファイル
├── postcss.config.mjs                               # PostCSS設定ファイル
├── README.md                                        # プロジェクトの説明ドキュメント
└── tsconfig.json                                    # TypeScript設定ファイル
```

<h2 id="environment-setup-procedure">環境構築の手順</h2>

### 前提条件

- Node.js 20 以上
- pnpm
- Git

### 1. リポジトリのクローン

```bash
git clone https://github.com/aoyamadev/output-quest.git
cd output-quest
```

### 2. パッケージのインストール

```bash
$ pnpm install
```

### 3. 環境変数の設定

```bash
# `.env.example`を参考に`.env`ファイルを作成し、必要な環境変数を設定してください。
$ cp .env.example .env
```

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# マイグレーションの実行
npx prisma migrate dev
```

### 5. 開発サーバーの起動（ローカル環境の立ち上げ）

```bash
$ pnpm dev
```

下記のローカル環境にアクセスして、アプリケーションの起動が確認できれば OK です。<br>
http://localhost:3000/<br>

<h2 id="project-overview">プロジェクト概要</h2>

「OUTPUT QUEST　叡智の継承者」は、私が開発したWebアプリです。RPG風のゲーミフィケーションを取り入れた "RPG風の新感覚学習アプリ" で、Zennで記事を投稿することでアプリ内の「勇者」が成長し、アイテムの入手、称号の獲得、仲間との出会いがあなたを待っています。アウトプットを通じて学習意欲や知的好奇心を高め、楽しみながら自己成長を促すことを目的に開発しました。

Next.js + CSS Modules + Tailwind CSS + TypeScriptで開発し、デプロイはVercelで行いました。

<h2 id="feature-introduction">機能紹介</h2>

「OUTPUT QUEST　叡智の継承者」の各ページの機能について紹介します。

### **トップページ**

ゲームのオープニングを彷彿とさせる演出により、冒険のはじまりを視覚的に表現しました。

![トップページ](/public/gif/readme/top-page.gif)

### **ダッシュボード**

勇者の冒険の拠点。勇者の成長度合いを示すレベル、Zennでの投稿数、勇者の仲間に加わったキャラや入手したアイテムを確認でき、Xへのシェアが可能です。

![ダッシュボード](/public/gif/readme/dashboard-page.gif)

### **学びの書**

Zennの記事を「これまでの学び」として記録する場所。Zennで投稿した記事が一覧表示され、学びの記録として振り返ることができます。記事はアプリ内ではカード型UIで表示され、クリックすることでZennの記事ページにアクセスできます。

![学びの書](public/gif/README/posts-page.gif)

### **記事探索**

AIが勇者の仲間の「賢者」として、次に書く記事に最適なテーマを提案。賢者（AI）は、あなたのZenn記事を探索し、過去の投稿から傾向を探ることで、あなたの成長に最適な「学びのタネ」を見つけ出します。

![記事探索](public/gif/readme/explore-page.gif)

### **つよさ**

勇者の成長度合いを示すレベル、レベルアップ報酬で獲得した「称号」の確認、勇者の「装備アイテム」の確認、これまでの学びの軌跡が残る「冒険ログ」の確認ができます。

![つよさ](public/images/readme/strength-page.png)

### **称号リスト**

勇者がレベルアップ報酬で獲得した称号を一覧で確認できます。

![称号リスト](public/images/readme/title-page.png)

### **そうび一覧**

勇者の装備アイテムを一覧で確認できます。

![そうび一覧](public/images/readme/equipment-page.png)

### **冒険ログ**

学びの軌跡が残る「冒険ログ」。これまでの学びの軌跡を時系列で確認できます。

![冒険ログ](public/images/readme/logs-page.png)

### **なかま**

勇者の仲間に加わったキャラクターを確認できます。1人1人のキャラクターの詳細情報も確認できます。

![なかま](public/images/readme/party-page.png)

### **アイテム**

勇者がレベルアップ報酬で入手したアイテムを確認できます。1つ1つのアイテムの詳細情報も確認できます。

![アイテム](public/images/readme/items-page.png)

### **連携**

Clerk認証によるログイン/新規登録、Zennのアカウント連携を管理できます。ログインとZenn連携をすることで、Zennの投稿データがアプリ内のUIに反映されます。アプリは「ログイン」「新規登録」無しでも利用できます。

![連携](public/gif/README/connection-page.gif)

### **Zennとの連携について**

OUTPUT QUESTとZennアカウントを連携させることで得られるメリットや、ゲストユーザーとしてアプリを手軽に体験する方法について解説します。あなたに合った方法で、OUTPUT QUESTの世界を体験できます。

![Zennとの連携について](public/images/readme/connection-detail-page.png)

### **OUTPUT QUESTとは ?**

OUTPUT QUESTの世界観と使い方、アウトプットを通じて成長する「RPG風新感覚学習アプリ」の始め方を解説します。アプリの概要、コンセプト、主要機能について紹介します。

![OUTPUT QUESTとは ?](public/gif/README/about-page.gif)

### **利用規約**

OUTPUT QUESTの利用規約を確認できます。

![利用規約](public/gif/README/terms-page.gif)

### **プライバシーポリシー**

OUTPUT QUESTのプライバシーポリシーを確認できます。

![プライバシーポリシー](public/gif/README/privacy-page.gif)

<h2 id="future-features">今後追加予定の機能やアップデート</h2>

### **記事探索機能のアップデート**

- LLMのモデル変更（現在：gemini-2.5-flash-preview-05-20）
- モデルの回答生成時の口調の変更（現在：老賢者）

### **連携できるプラットフォームの追加**

- 現在：Zennのみ
- 追加予定：izanami, note, Qiita

### **冒頭ログのアップデート**

- 表示ログの種類を拡張

### **アプリ内で入手できる報酬の追加**

- 新アイテム、新称号、新キャラ（なかま）の追加

### **勇者のレベル上限の拡張**

- 現在の上限：Lv99

### **主人公の変更機能を追加**

- 現在は勇者のみ（変更不可）
- 主人公に設定できるキャラを、「勇者のなかま」から選択できるように


<h2 id="how-to-use">アプリの利用方法</h2>

```bash
# 1. Clerkによるログイン
/connectionページにて、ログインを実行。

# 2. Zennのアカウントと連携
Clerkによるログイン完了後、連携するZennアカウントのユーザー名を入力して、連携。

# 3. 冒険をはじめよう！
ClerkによるログインとZennアカウントの連携が完了したら、早速冒険をはじめよう！
```
