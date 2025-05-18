import { Metadata } from "next";

export function generateEquipmentMetadata(equipmentSlug: string): Metadata {
  const equipmentNameMap: Record<string, string> = {
    weapon: "武器",
    shield: "盾",
    helmet: "かぶと",
    armor: "よろい",
    accessory: "アクセサリー",
  };
  const name = equipmentNameMap[equipmentSlug] || equipmentSlug;
  return {
    title: `そうび一覧（${name}）`,
    description: `勇者の装備アイテム（${name}）を一覧で確認できます。`,
  };
}
