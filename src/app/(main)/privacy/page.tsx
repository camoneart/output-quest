import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PrivacyPage.module.css";
import AdventureStartLink from "@/components/common/AdventureStartLink/AdventureStartLink";
import Link from "next/link";

export const metadata: Metadata = getPageMetadata("privacy");

const PrivacyPage = () => {
	return (
		<>
			<h1 className={`${styles["privacy-title"]}`}>プライバシーポリシー</h1>
			<div className={`${styles["privacy-container"]}`}>
				<div className={`${styles["privacy-content"]} w-full`}>
					<p className="text-base md:text-lg leading-[1.75] font-weight-normal px-[20px] md:px-[50px] pt-[10px] md:pt-[30px]">
						「OUTPUT QUEST　~ 叡智の継承者 ~」（以下、「当サービス」といいます。）は、ユーザーの個人情報について以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
					</p>
					<article className={styles["privacy-article"]}>
						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										1. 個人情報の収集方法
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								当サービスは、ユーザーが利用登録をする際に氏名、メールアドレス、プロフィール画像などの個人情報をお尋ねすることがあります。これらは、ユーザーが利用する認証サービス（Google、GitHubなど）から提供される情報を含みます。また、ユーザーと提携先などとの間でなされた取引の状況や内容、サービスの閲覧履歴、および履歴情報特性の情報を収集することがあります。
							</p>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										2. 個人情報を収集・利用する目的
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								当サービスが個人情報を収集・利用する目的は、以下のとおりです。
							</p>
							<ol className={styles["privacy-section-list"]}>
								<li className={styles["privacy-section-list-item"]}>
									当サービスの提供・運営のため
								</li>
								<li className={styles["privacy-section-list-item"]}>
									ユーザーからのお問い合わせに回答するため
								</li>
								<li className={styles["privacy-section-list-item"]}>
									ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当サービスが提供する他のサービスの案内のメールを送付するため
								</li>
								<li className={styles["privacy-section-list-item"]}>
									メンテナンス、重要なお知らせなど必要に応じたご連絡のため
								</li>
								<li className={styles["privacy-section-list-item"]}>
									利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
								</li>
								<li className={styles["privacy-section-list-item"]}>
									ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
								</li>
							</ol>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										3. 個人情報の第三者提供
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
							</p>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										4. 個人情報の開示
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								当サービスは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
							</p>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										5. 個人情報の訂正および削除
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								ユーザーは、当サービスの保有する自己の個人情報が誤った情報である場合には、当サービスが定める手続きにより、当サービスに対して個人情報の訂正、追加または削除を請求することができます。
							</p>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										6. Cookie（クッキー）その他技術の利用
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								当サービスは、サービスの利便性の向上、利用状況の把握、最適なサービスの提供のためにCookieおよびGoogle
								Analyticsなどのアクセス解析ツールを利用しています。これにより、ユーザーのウェブサイト利用状況に関する情報を収集しますが、個人を特定する情報は含まれておりません。
							</p>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										7. プライバシーポリシーの変更
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当サービスが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
							</p>
						</section>

						<section className={`${styles["privacy-section"]}`}>
							<div className={styles["privacy-section-title-container"]}>
								<div className={styles["privacy-section-title-box"]}>
									<h2 className={styles["privacy-section-title"]}>
										8. お問い合わせ
									</h2>
								</div>
							</div>
							<p className={styles["privacy-section-message"]}>
								本ポリシーに関するお問い合わせは、下記の連絡先までお願いいたします。
							</p>
							<div className="grid gap-1">
								<p className="text-lg font-bold">【連絡先】</p>
								<dl className="grid gap-4">
									<div>
										<dt className="">開発者のメールアドレス：</dt>
										<dd>
											<Link
												href="mailto:aoymdev@gmail.com"
												className="underline underline-offset-2"
											>
												aoymdev@gmail.com
											</Link>
										</dd>
									</div>
									<div>
										<dt className="">開発者のX：</dt>
										<dd>
											<Link
												href="https://x.com/aoyamadev"
												className="underline underline-offset-2"
											>
												@aoyamadev
											</Link>
										</dd>
									</div>
								</dl>
							</div>
						</section>

						<AdventureStartLink />
					</article>
				</div>
			</div>
		</>
	);
};

export default PrivacyPage;
