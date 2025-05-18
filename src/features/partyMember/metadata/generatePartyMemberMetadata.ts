import { Metadata } from "next";
import { baseMetadata } from "@/config/metadata";
import {
  heroLevelAndMemberRelation,
  customMemberNames,
  customMemberDescriptions,
} from "@/features/party/data/partyMemberData";

/**
 * なかま詳細ページのメタデータを生成する関数
 * @param partyId なかまID
 * @returns メタデータオブジェクト
 */
export async function generatePartyMemberMetadata(
  partyId: number
): Promise<Metadata> {
  // 無効なIDの場合の処理
  if (isNaN(partyId) || partyId < 1 || partyId > 30) {
    return {
      ...baseMetadata,
      title: "なかまが見つかりません",
      description: "指定されたなかまは存在しません。",
    };
  }

  // なかまのメタデータを生成
  const memberName = customMemberNames[partyId];
  const memberDescription = customMemberDescriptions[partyId];
  const requiredLevel = heroLevelAndMemberRelation[partyId] || partyId;

  // 常に両方のパターンのメタデータを返す
  // クライアントサイドでレンダリング時に適切なデータが表示される
  return {
    ...baseMetadata,
    title: memberName,
    description: memberDescription,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${memberName}｜なかま詳細`,
      description: memberDescription,
      images: [
        {
          url: `/images/party-page/acquired-icon/party-member-${partyId}.svg`,
          width: 200,
          height: 200,
          alt: memberName,
        },
      ],
    },
    alternates: {
      canonical: `/party/${partyId}`,
    },
    other: {
      // 未獲得の場合のタイトルと説明をカスタムプロパティとして保存
      unacquiredTitle: "未獲得のなかま",
      unacquiredDescription: `このなかまはレベル${requiredLevel}で獲得できます。冒険を続けて探索しましょう。`,
      requiredLevel: `${requiredLevel}`,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://outputquest.com"
    ),
  };
}
