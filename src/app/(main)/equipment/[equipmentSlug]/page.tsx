import { Suspense } from "react";
import { Metadata } from "next";
import * as EquipmentDetail from "@/features/equipment-detail/components/index";
import { generateEquipmentMetadata } from "@/features/equipment-detail/metadata/generateItemMetadata";
import styles from "./EquipmentDetailPage.module.css";
import LoadingIndicator from "@/components/common/loading-indicator/LoadingIndicator";

export async function generateStaticParams() {
	return [
		{ equipmentSlug: "weapon" },
		{ equipmentSlug: "shield" },
		{ equipmentSlug: "helmet" },
		{ equipmentSlug: "armor" },
		{ equipmentSlug: "accessory" },
	];
}

const getEquipmentName = (id: string) => {
	switch (id) {
		case "weapon":
			return "武器";
		case "shield":
			return "盾";
		case "helmet":
			return "かぶと";
		case "armor":
			return "よろい";
		case "accessory":
			return "アクセサリー";
		default:
			return "";
	}
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ equipmentSlug: string }>;
}): Promise<Metadata> {
	const { equipmentSlug } = await params;
	return generateEquipmentMetadata(equipmentSlug);
}

export default async function EquipmentDetailPage({
	params,
}: {
	params: Promise<{ equipmentSlug: string }>;
}) {
	const { equipmentSlug } = await params;
	return (
		<>
			<div className={styles["title-bg"]}></div>
			<h1 className={`${styles["equipment-detail-title"]}`}>
				そうび一覧（{getEquipmentName(equipmentSlug)}）
			</h1>
			<div className={`${styles["equipment-detail-container"]}`}>
				<Suspense
					fallback={
						<div className="grid place-items-center">
							<LoadingIndicator  />
						</div>
					}
				>
					<EquipmentDetail.EquipmentDetailPageClient
						equipmentSlug={equipmentSlug}
					/>
				</Suspense>
			</div>
		</>
	);
}
