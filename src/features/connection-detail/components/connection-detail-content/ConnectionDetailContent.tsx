import React from "react";
import styles from "./ConnectionDetailContent.module.css";
import Link from "next/link";
import Image from "next/image";

const ConnectionDetailContent = () => {
	return (
		<div className={`${styles["connection-detail-content"]}`}>
			<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-subgrid row-span-6 lg:row-span-3 gap-10 lg:gap-2 items-start h-full">
				{/* ログインユーザー */}
				<div className="grid grid-cols-1 grid-rows-subgrid row-span-3 gap-2.5">
					<div
						className={`${styles["connection-detail-content-box"]} bg-[#0f6ebc]`}
					>
						<dl className="grid grid-cols-1 gap-2 place-items-center">
							<div className="w-full grid gap-3">
								<dt className="text-base md:text-lg font-bold w-full text-center pb-[12px] border-b border-white [filter:drop-shadow(1px_1px_0px_#000)]">
									【ログインユーザー】
								</dt>
								<dd
									className={`${styles["connection-detail-content-text"]} text-sm leading-[1.75] w-full [text-shadow:1px_1px_0px_#000]`}
								>
									連携ページにてログイン後、ご自身のZennアカウントを連携させると、Zennでの活動状況に応じてアプリ内の勇者が「経験値」を獲得し、レベルアップしていきます。経験値を獲得して勇者がレベルアップすることで、新たな「称号」の獲得、「アイテム」の入手、新しい「仲間」との出会いがあなたを待っています。
								</dd>
							</div>
						</dl>
						<div className="grid gap-2">
							<em className="text-sm md:text-base not-italic font-bold text-[#ffc400] [text-shadow:1px_1px_0px_#000]">
								【こんな方にオススメ】
							</em>
							<ul
								className={`${styles["connection-detail-list"]} [text-shadow:1px_1px_0px_#000]`}
							>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									自分のZennアカウントを連携してアプリを利用したい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									OUTPUT QUESTを利用して、技術発信のモチベーションを高めたい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									自分のZennでの活動を可視化したい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									ゲーム感覚で楽しく学習を継続したい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									「アイテム」の入手、「仲間」との出会いを楽しみたい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									冒険の証として称号をコレクションしたい
								</li>
							</ul>
						</div>
					</div>
					<div className="text-xs opacity-50 text-center grid gap-1.5">
						<p>「ログインユーザー」</p>
						<p>ログイン / 新規登録 に加え、Zenn連携を完了したユーザーのこと</p>
					</div>
				</div>
				{/* ゲストユーザー */}
				<div className="grid grid-cols-1 grid-rows-subgrid row-span-3 gap-2.5">
					<div
						className={`${styles["connection-detail-content-box"]} bg-[#333]`}
					>
						<dl className="grid grid-cols-1 gap-2 place-items-center">
							<div className="w-full grid gap-3">
								<dt className="text-base md:text-lg font-bold w-full text-center pb-[12px] border-b border-white [filter:drop-shadow(1px_1px_0px_#000)]">
									【ゲストユーザー】
								</dt>
								<dd
									className={`${styles["connection-detail-content-text"]} text-sm leading-[1.75] w-full [text-shadow:1px_1px_0px_#000]`}
								>
									ゲストとして、まずは気軽にアプリの世界を体験してみませんか？
									ゲストユーザーは開発者のZennアカウント(@aoyamadev)をサンプルとして、OUTPUT
									QUESTの世界観を体験できます。ログイン、新規登録は一切不要です。
								</dd>
							</div>
						</dl>
						<div className="grid gap-2">
							<em className="text-sm md:text-base not-italic font-bold text-[#ffc400] [text-shadow:1px_1px_0px_#000]">
								【こんな方にオススメ】
							</em>
							<ul
								className={`${styles["connection-detail-list"]} [text-shadow:1px_1px_0px_#000]`}
							>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									ログイン/新規登録の手間を省きたい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									まずは、アプリの雰囲気だけ掴みたい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									アプリの機能を一通り見てみたい
								</li>
								<li
									className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
								>
									Zennと連携することで、勇者の成長にどう繋がるのか見てみたい
								</li>
							</ul>
						</div>
					</div>
					<div className="text-xs opacity-50 text-center grid gap-[5px]">
						<p>「ゲストユーザー」</p>
						<p>ログイン / 新規登録 を完了していないユーザーのこと</p>
					</div>
				</div>
			</div>
			<div className="mt-[20px] lg:mt-2 grid place-items-center">
				<Link
					href="/connection"
					className={styles["connection-detail-back-link"]}
				>
					<Image
						src="/images/arrow/arrow-icon.svg"
						alt="連携ページに戻る"
						width={18}
						height={18}
						className={styles["connection-detail-back-link-icon"]}
					/>
					<span className={styles["connection-detail-back-link-text"]}>
						連携ページに戻る
					</span>
				</Link>
			</div>
		</div>
	);
};

export default ConnectionDetailContent;
