// partyページで使用する型定義
export interface PartyMember {
  id: number;
  name: string | null;
  description?: string | null;
  acquired: boolean;
}

export interface PartyData {
  partyMembers: PartyMember[];
}
