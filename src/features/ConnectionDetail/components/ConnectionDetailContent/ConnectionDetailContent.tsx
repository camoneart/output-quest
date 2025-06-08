import React from "react";
import styles from "./ConnectionDetailContent.module.css";

const ConnectionDetailContent = () => {
	return (
		<div className={`${styles["connection-detail-content"]}`}>
			<div className="grid grid-cols-2 grid-rows-subgrid row-span-2 gap-2 items-start h-full">
				<div
					className={`${styles["connection-detail-content-box"]} bg-[#0f6ebc]`}
				>
					<dl className="grid grid-cols-1 gap-2 place-items-center">
						<div className="w-full grid gap-3">
							<dt className="text-base md:text-lg font-bold w-full text-center pb-[12px] border-b border-white">
								【ログインユーザー】
							</dt>
							<dd
								className={`${styles["connection-detail-content-text"]} text-sm leading-[1.75] w-full`}
							>
								ログイン後、ご自身のZennアカウントを連携させると、あなたの記事投稿や活動がゲーム内の勇者の「経験値」や「アイテム」に変換されます。アウトプットを通して勇者を成長させましょう！
							</dd>
						</div>
					</dl>
					<div className="grid gap-2">
						<em className="text-sm md:text-base not-italic font-bold text-[#ffc400]">
							【こんな方にオススメ】
						</em>
						<ul
							className={`${styles["connection-detail-list"]} grid grid-cols-1 gap-0.5`}
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
								「アイテム」の獲得、「なかま」との出会いを楽しみたい
							</li>
							<li
								className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
							>
								冒険の証として称号をコレクションしたい
							</li>
						</ul>
					</div>
				</div>
				<div className={`${styles["connection-detail-content-box"]} bg-[#333]`}>
					<dl className="grid grid-cols-1 gap-2 place-items-center">
						<div className="w-full grid gap-3">
							<dt className="text-base md:text-lg font-bold w-full text-center pb-[12px] border-b border-white">
								【ゲストユーザー】
							</dt>
							<dd
								className={`${styles["connection-detail-content-text"]} text-sm leading-[1.75] w-full`}
							>
								ゲストとして、まずは気軽にアプリの世界を体験してみませんか？
								ゲストユーザーは開発者のZennアカウント(@aoyamadev)をサンプルとして、OUTPUT QUESTの世界観を体験できます。ログイン、新規登録は不要です。
							</dd>
						</div>
					</dl>
					<div className="grid gap-2">
						<em className="text-sm md:text-base not-italic font-bold text-[#ffc400]">
							【こんな方にオススメ】
						</em>
						<ul
							className={`${styles["connection-detail-list"]} grid grid-cols-1 gap-0.5`}
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
								どんな「アイテム」や「称号」が手に入るのか見てみたい
							</li>
							<li
								className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
							>
								どんな「なかま」と出会えるか見てみたい
							</li>
							<li
								className={`${styles["connection-detail-list-item"]} text-sm leading-[1.75] w-full`}
							>
								アプリの機能を一通り見てみたい
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-2 place-items-center">
				<div className="text-xs opacity-50 text-center grid gap-1.5">
					<p>「ログインユーザー」</p>
					<p>「ログイン」または「新規登録」を完了したユーザーのこと</p>
				</div>
				<div className="text-xs opacity-50 text-center grid gap-1.5">
					<p>「ゲストユーザー」</p>
					<p>「ログイン」または「新規登録」を完了していないユーザーのこと</p>
				</div>
			</div>
			<div className="mt-5 pb-1 grid place-items-center">
				<a
					href="/connection"
					className="text-base px-2 underline underline-offset-4"
				>
					連携ページに戻る
				</a>
			</div>
		</div>
	);
};

export default ConnectionDetailContent;
