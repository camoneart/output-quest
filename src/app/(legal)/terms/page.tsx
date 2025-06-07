import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./TermsPage.module.css";
import * as Legal from "@/features/legal/components/index";

export const metadata: Metadata = getPageMetadata("terms");

const TermsPage = () => {
	return (
		<>
			<h2 className={`${styles["terms-title"]}`}>利用規約</h2>
			<div className={`${styles["terms-container"]}`}>
				<div className={`${styles["terms-content"]} w-full max-w-5xl`}>
					<p className="text-lg leading-[1.75] font-weight-normal">
						この利用規約（以下、「本規約」といいます。）は、「OUTPUT QUEST ~ 叡智の継承者 ~」（以下、「当サービス」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。
					</p>
					<article className={styles["terms-article"]}>
						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第1条（適用）
									</h3>
								</div>
							</div>
							<p className={styles["terms-section-message"]}>
								<ol className={styles["terms-section-list"]}>
									<li className={styles["terms-section-list-item"]}>
										本規約は、ユーザーと当サービスとの間の本サービスの利用に関わる一切の関係に適用されるものとします。
									</li>
									<li className={styles["terms-section-list-item"]}>
										本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
									</li>
								</ol>
							</p>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第2条（利用登録）
									</h3>
								</div>
							</div>
							<ol className={styles["terms-section-list"]}>
								<li className={styles["terms-section-list-item"]}>
									本サービスにおいては、登録希望者が本規約に同意の上、当サービスの定める方法によって利用登録を申請し、当サービスがこれを承認することによって、利用登録が完了するものとします。
								</li>
								<li className={styles["terms-section-list-item"]}>
									当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
								</li>
								<ol className={styles["terms-section-list"]}>
									<li className={styles["terms-section-list-item"]}>
										虚偽の事項を届け出た場合
									</li>
									<li className={styles["terms-section-list-item"]}>
										本規約に違反したことがある者からの申請である場合
									</li>
									<li className={styles["terms-section-list-item"]}>
										反社会的勢力等との何らかの関わりがあると判断される場合
									</li>
									<li className={styles["terms-section-list-item"]}>
										その他、当サービスが利用登録を相当でないと判断した場合
									</li>
								</ol>
							</ol>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第3条（禁止事項）
									</h3>
								</div>
							</div>
							<p className={styles["terms-section-message"]}>
								ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
							</p>
							<ol className={styles["terms-section-list"]}>
								<li className={styles["terms-section-list-item"]}>
									法令または公序良俗に違反する行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									犯罪行為に関連する行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									当サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									当サービスのサービスの運営を妨害するおそれのある行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									他のユーザーに関する個人情報等を収集または蓄積する行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									他のユーザーに成りすます行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									当サービスのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									当サービスまたは第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為
								</li>
								<li className={styles["terms-section-list-item"]}>
									過度に暴力的な表現、露骨な性的表現、人種、国籍、信条、性別、社会的身分、門地等による差別につながる表現、自殺、自傷行為、薬物乱用を誘引または助長する表現、その他反社会的な内容を含み他人に不快感を与える表現を投稿または送信する行為
								</li>
							</ol>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第4条（本サービスの提供の停止等）
									</h3>
								</div>
							</div>
							<ol className={styles["terms-section-list"]}>
								<li className={styles["terms-section-list-item"]}>
									当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
								</li>
								<ol className={styles["terms-section-list"]}>
									<li className={styles["terms-section-list-item"]}>
										本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
									</li>
									<li className={styles["terms-section-list-item"]}>
										地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
									</li>
									<li className={styles["terms-section-list-item"]}>
										コンピュータまたは通信回線等が事故により停止した場合
									</li>
									<li className={styles["terms-section-list-item"]}>
										その他、当サービスが本サービスの提供が困難と判断した場合
									</li>
								</ol>
								<li className={styles["terms-section-list-item"]}>
									当サービスは、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
								</li>
							</ol>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第5条（免責事項）
									</h3>
								</div>
							</div>
							<ol className={styles["terms-section-list"]}>
								<li className={styles["terms-section-list-item"]}>
									当サービスの債務不履行責任は、当サービスの故意または重過失によらない場合には免責されるものとします。
								</li>
								<li className={styles["terms-section-list-item"]}>
									当サービスは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間で生じた取引、連絡または紛争等について、一切責任を負いません。
								</li>
							</ol>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第6条（ユーザーの投稿等）
									</h3>
								</div>
							</div>
							<ol className={styles["terms-section-list"]}>
								<li className={styles["terms-section-list-item"]}>
									本サービスにおいてユーザーが投稿、アップロード、または送信したコンテンツ（以下、「ユーザーコンテンツ」といいます。）に関する著作権は、当該ユーザー自身に留保されるものとします。ただし、当サービスは、本サービスの提供、改善、宣伝広告に必要な範囲内において、ユーザーコンテンツを無償で利用（複製、上映、公衆送信、展示、頒布、翻訳、改変等を含みます。）できるものとし、ユーザーはこれを許諾するものとします。
								</li>
								<li className={styles["terms-section-list-item"]}>
									ユーザーは、ユーザーコンテンツが第三者の権利を侵害しないことを保証するものとします。ユーザーコンテンツに起因して第三者との間で紛争が生じた場合、ユーザーは自己の責任と費用においてこれを解決するものとします。
								</li>
							</ol>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第7条（サービス内容の変更等）
									</h3>
								</div>
							</div>
							<p className={styles["terms-section-message"]}>
								当サービスは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
							</p>
						</section>

						<section className={`${styles["terms-section"]}`}>
							<div className={styles["terms-section-title-container"]}>
								<div className={styles["terms-section-title-box"]}>
									<h3 className={styles["terms-section-title"]}>
										第8条（利用規約の変更）
									</h3>
								</div>
							</div>
							<p className={styles["terms-section-message"]}>
								当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
							</p>
						</section>
						<Legal.LegalLink />
					</article>
				</div>
			</div>
		</>
	);
};

export default TermsPage;
