import { Metadata } from "next";
import { Suspense } from "react";
import { getPageMetadata } from "@/config/metadata";
import styles from "./StrengthPage.module.css";
import * as Strength from "@/features/strength/components/index";
import StrengthHeroInfo from "@/features/strength/components/strength-hero-info/StrengthHeroInfo";
import StrengthHeroInfoSkeleton from "@/features/strength/components/strength-hero-info-skeleton/StrengthHeroInfoSkeleton";

export const metadata: Metadata = getPageMetadata("strength");

const StrengthPage = () => {
	return (
		<>
			<h1 className={`${styles["strength-title"]}`}>つよさ</h1>
			<div className={`${styles["strength-container"]}`}>
				<div className={styles["strength-content"]}>
					{/* （左上）勇者のコンテンツ */}
					<Suspense fallback={<StrengthHeroInfoSkeleton />}>
						<StrengthHeroInfo />
					</Suspense>
					{/* （右上）称号 */}
					<Strength.StrengthTitleInfo />
					{/* （左下）装備アイテムリスト */}
					<Strength.StrengthEquipmentInfo />
					{/* （右下）冒険ログ */}
					<Strength.StrengthLogInfo />
				</div>
			</div>
		</>
	);
};

export default StrengthPage;
