import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./AboutPage.module.css";
import AdventureStartLink from "@/components/common/adventure-start-link/AdventureStartLink";

export const metadata: Metadata = getPageMetadata("about");

const AboutPage = () => {
	return (
		<>
			<h1 className={`${styles["about-title"]}`}>OUTPUT QUESTとは ?</h1>
			<div className={`${styles["about-container"]}`}>
				<div className={`${styles["about-content"]} w-full`}>
					<article className={styles["about-article"]}>
						<section className={`${styles["about-section"]}`}>
							<div className={styles["about-section-title-container"]}>
								<div className={styles["about-section-title-box"]}>
									<h2 className={styles["about-section-title"]}>はじめに</h2>
								</div>
							</div>
							<p className={styles["about-section-message"]}>
								「<em>OUTPUT QUEST　叡智の継承者</em>」は、アウトプットで知識を磨き、勇者を育てる "RPG風新感覚学習アプリ" です。
							</p>
							<p className={styles["about-section-message"]}>
								この世界では <em>Zenn</em>で記事を書くことで経験値を獲得することができ、勇者のレベルを上げることができます。
							</p>
							<p className={styles["about-section-message"]}>
								アウトプットを続けることで、あなたは<em>「叡智の継承者」</em>として、優れた知識と知恵を未来へとつないでいくのです。
							</p>
						</section>

						<section className={`${styles["about-section"]}`}>
							<div className={styles["about-section-title-container"]}>
								<div className={styles["about-section-title-box"]}>
									<h2 className={styles["about-section-title"]}>
										このアプリでできること
									</h2>
								</div>
							</div>
							<dl className={styles["about-section-list"]}>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										レベル上げ機能
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										Zennで記事を書くことで、勇者が経験値を得られます。経験値を獲得して勇者がレベルアップすることで、新たな「称号」の獲得、「アイテム」の入手、新しい「仲間」との出会いがあなたを待っています。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										成長の可視化
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										ダッシュボードページでは、勇者の成長度合いを示すレベル、Zennでの投稿数、勇者が出会った「仲間」や、レベルアップ報酬で入手した「アイテム」を確認できます。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										投稿した記事の確認
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										Zennで投稿した記事がアプリ内で一覧表示され、学びの記録として、これまでの学びを振り返ることができます。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										記事の探索
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										AIがZennの記事を探索して過去の投稿から傾向を探り、次に書く記事に最適なテーマをあなたに提案します。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										称号の獲得
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										勇者はレベルアップの節目で伝説に語られる称号を授かります。「見習い勇者」から始まり、成長と共に「叡智の継承者」へと至る数々の称号があなたの学びの冒険を彩ります。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										冒険ログ
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										あなたの学びの冒険の記録を時系列で確認できるログです。ログには「勇者がレベルアップした日の記録」が残ります。冒険ログを振り返ることで、自分の成長を実感できるでしょう。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										仲間との出会い
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										勇者のレベルを上げていくことで、勇者の仲間となる様々なキャラクターに出会えます。レベル99に到達したとき、勇者は「伝説の存在」と出会えるかもしれません...。
									</dd>
								</div>
								<div className={styles["about-section-list-content"]}>
									<dt className={styles["about-section-list-content-title"]}>
										アイテムの入手
									</dt>
									<dd
										className={styles["about-section-list-content-description"]}
									>
										勇者のレベルを上げていくことで、様々なアイテムを入手できます。回復アイテムや、初級、中級、上級装備、アクセサリーなどを入手できます。勇者が成長し、高いレベルになることで貴重な高級装備や、勇者シリーズ、そして最後には伝説の装備品が入手できるかもしれません...。
									</dd>
								</div>
							</dl>
						</section>

						<section className={`${styles["about-section"]}`}>
							<div className={styles["about-section-title-container"]}>
								<div className={styles["about-section-title-box"]}>
									<h2 className={styles["about-section-title"]}>
										学びの冒険を始めよう！
									</h2>
								</div>
							</div>
							<p className={styles["about-section-message"]}>
								アウトプットは知識を定着させる最も効果的な方法です。
							</p>
							<p className={styles["about-section-message"]}>
								インプットだけでは、得た知識は時間と共に薄れていきますが、アウトプットすることで自分の言葉として知識を再構築し、深い理解へと昇華させることができます。
							</p>
							<p className={styles["about-section-message"]}>
								記事を書くことで、あなたの中の「曖昧な理解」は「確かな知識」へと変わります。整理された思考、明確な表現力、論理的な構成力が磨かれ、自分自身の成長を実感できるでしょう。
							</p>
							<p className={styles["about-section-message"]}>
								そして、あなたのアウトプットは他者の「インプット」となり、知識の循環を生み出します。あなたの記事が誰かの疑問を解決し、誰かの学びを加速させ、新たな知の創造につながるのです。これこそが「叡智の継承」の真髄です。
							</p>
							<p className={styles["about-section-message"]}>
								「OUTPUT QUEST　叡智の継承者」は、アウトプットをRPG風の楽しい体験に変え、継続的な成長をサポートします。勇者がレベルアップする喜び、獲得の称号、仲間との出会いやアイテムの入手という達成感を通じて、あなたの学びの冒険をより豊かなものへと導きます。
							</p>
							<p className={styles["about-section-message"]}>
								アウトプットに完璧な準備は必要ありません。大切なのは、アウトプットをすることで得られる「本質的な理解」です。アウトプットを続けて自己成長へ繋げることで、自らを「学びの勇者」へと導くのです。
							</p>
						</section>

						<p className={styles["about-section-last-message"]}>
							<span className={styles["about-section-last-message-text"]}>
								さあ、学びの勇者よ...
							</span>
							<span className={styles["about-section-last-message-text"]}>
								あなたの学びの冒険が今、始まります。
							</span>
						</p>

						<hr />

						<AdventureStartLink />
					</article>
				</div>
			</div>
		</>
	);
};

export default AboutPage;
