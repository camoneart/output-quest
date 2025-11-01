"use client";

import Image from "next/image";
import styles from "../strength-hero-info/StrengthHeroInfo.module.css";

type StrengthHeroInfoClientProps = {
	heroData: {
		name: string;
		level: number;
		currentExp: number;
		nextLevelExp: number;
		remainingArticles: number;
	};
	zennUsername: string;
};

/**
 * StrengthHeroInfoClient (Client Component)
 *
 * 勇者のレベル情報を表示するClient Component
 * StrengthHeroInfo（Server Component）から分離
 */
const StrengthHeroInfoClient = ({
	heroData,
	zennUsername,
}: StrengthHeroInfoClientProps) => {
	// 経験値の進捗率をパーセンテージで計算
	const expProgressPercent =
		(heroData.currentExp / heroData.nextLevelExp) * 100;

	return (
		<div className={styles["strength-hero-info"]}>
			<div className={styles["strength-hero-info-content"]}>
				<h2 className={styles["strength-hero-info-title"]}>~ 勇者のレベル ~</h2>
				<div className={styles["strength-hero-info-content-head"]}>
					{/* 勇者のアイコン　*/}
					<div className={styles["strength-hero-box"]}>
						<div className={styles["strength-hero-icon-box"]}>
							<Image
								src="/images/common/character_yusha_01_red.png"
								alt="勇者のアイコン"
								width={50}
								height={50}
								priority={true}
								className={styles["strength-hero-icon-image"]}
							/>
						</div>
						<div className={styles["strength-hero-name-box"]}>
							<h3 className={`${styles["strength-hero-name"]}`}>
								{heroData.name}({zennUsername})
							</h3>
						</div>
					</div>
					{/* レベル表示 */}
					<div className={styles["strength-level-info"]}>
						<div className={`${styles["strength-level-display-container"]}`}>
							<div className={`${styles["strength-level-display-box"]}`}>
								<div className={`${styles["strength-level-display"]}`}>
									<span className={`${styles["strength-level-display-text"]}`}>
										Lv
									</span>
									<span className={`${styles["strength-level-display-value"]}`}>
										{heroData.level}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* 経験値バー */}
				<div className={styles["strength-level-progress-info"]}>
					<div className={`${styles["strength-level-progress-box"]}`}>
						<div className={`${styles["strength-level-progress-content"]}`}>
							<span className={`${styles["strength-level-progress-text"]}`}>
								次のレベルまで：
							</span>
							<div
								className={`${styles["strength-level-progress-info-remaining-articles"]}`}
							>
								<em
									className={`${styles["strength-level-progress-info-remaining-articles-em"]}`}
								>
									{heroData.remainingArticles}
								</em>
								<span
									className={`${styles["strength-level-progress-info-remaining-articles-unit"]}`}
								>
									記事
								</span>
							</div>
						</div>
						<div className={`${styles["strength-level-progress-gauge-container"]}`}>
							<Image
								src="/images/common/exp.svg"
								alt="EXP"
								width={35}
								height={35}
								priority={true}
								className={`${styles["strength-level-progress-exp-icon"]}`}
							/>
							<div className={`${styles["strength-level-progress-gauge-box"]}`}>
								<div
									className={`${styles["strength-level-progress-gauge"]}`}
									style={{ width: `${expProgressPercent}%` }}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StrengthHeroInfoClient;
