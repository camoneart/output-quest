import { Metadata } from "next";
import * as EquipmentDetail from "@/features/equipment-detail/components/index";
import { generateEquipmentMetadata } from "@/features/equipment-detail/metadata/generateItemMetadata";

export async function generateMetadata(
  { params }: { params: Promise<{ equipmentSlug: string }> }
): Promise<Metadata> {
  const { equipmentSlug } = await params;
  return generateEquipmentMetadata(equipmentSlug);
}

export default async function EquipmentDetailPage(
  { params }: { params: Promise<{ equipmentSlug: string }> }
) {
  const { equipmentSlug } = await params;
  return (
    <EquipmentDetail.EquipmentDetailPageClient equipmentSlug={equipmentSlug} />
  );
}
