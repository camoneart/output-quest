import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import styles from "./PartyMemberPage.module.css";
import * as PartyMember from "@/features/party-member/components/index";
import { generatePartyMemberMetadata } from "@/features/party-member/metadata/generatePartyMemberMetadata";

export async function generateMetadata(
  { params }: { params: Promise<{ partyId: string }> }
): Promise<Metadata> {
  const { partyId } = await params;
  const partyIdNum = parseInt(partyId);
  return generatePartyMemberMetadata(partyIdNum);
}

export default async function PartyMemberPage(
  { params }: { params: Promise<{ partyId: string }> }
) {
  const { partyId } = await params;
  const partyIdNum = parseInt(partyId);

  if (isNaN(partyIdNum) || partyIdNum < 1 || partyIdNum > 30) {
    notFound();
  }

  return (
    <>
      {/* 動的にHeadを更新するコンポーネント */}
      <PartyMember.PartyMemberDynamicHead partyId={partyIdNum} />

      <h1 className={`${styles["party-member-page-title"]}`}>なかま詳細</h1>
      <div className={styles["party-member-container"]}>
        {/* クライアントコンポーネントとしてPartyMemberDetailを使用 */}
        <PartyMember.PartyMemberDetail partyId={partyIdNum} />

        <hr />

        <PartyMember.PartyMemberFooter />
      </div>
    </>
  );
}
