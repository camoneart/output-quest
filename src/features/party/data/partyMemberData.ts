import { PartyMember, PartyData } from "../types/party.types";

// メンバーIDと必要な勇者レベルの関係
// キー: メンバーID, 値: そのメンバーを獲得するために必要な勇者レベル
export const heroLevelAndMemberRelation: { [key: number]: number } = {
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  5: 15,
  6: 18,
  7: 21,
  8: 24,
  9: 27,
  10: 30,
  11: 33,
  12: 36,
  13: 39,
  14: 42,
  15: 45,
  16: 48,
  17: 51,
  18: 54,
  19: 57,
  20: 60,
  21: 63,
  22: 66,
  23: 69,
  24: 72,
  25: 75,
  26: 80,
  27: 85,
  28: 90,
  29: 95,
  30: 99,
};

// カスタムなかま名の定義
export const customMemberNames: { [key: number]: string } = {
  1: "村人（男）",
  2: "村人（女）",
  3: "盗賊",
  4: "がいこつ",
  5: "ゾンビ",
  6: "ミイラ",
  7: "僧侶",
  8: "占い師",
  9: "兵士",
  10: "がいこつの騎士",
  11: "王妃",
  12: "王様",
  13: "魔道士",
  14: "闇の賢者",
  15: "弓使い",
  16: "デーモン",
  17: "かみさま",
  18: "妖精",
  19: "風の戦士",
  20: "氷の戦士",
  21: "炎の戦士",
  22: "魔王",
  23: "光の騎士",
  24: "冥府の剣士",
  25: "デビル",
  26: "大天使",
  27: "ホーリードラゴン",
  28: "ダークドラゴン",
  29: "闇の勇者",
  30: "伝説の龍",
};

// カスタムなかま説明文の定義
export const customMemberDescriptions: { [key: number]: string } = {
  1: "平和な村で暮らす少年。特別な力はないが、強い心を持つ。",
  2: "平和な村で暮らす少女。穏やかで優しいが、芯の強さを秘めている。",
  3: "闇に生きる盗賊。素早い動きと高い知能で敵を翻弄する。",
  4: "呪われた剣士のなれの果て。死しても戦い続ける。",
  5: "不死の呪いを受けた者。ゆっくりと迫る恐怖の存在。",
  6: "古代の王の守護者。包帯の下に隠された怨念を持つ。",
  7: "癒しの力を操る聖職者。傷ついたなかまを救う支え。",
  8: "未来を見通す力を持つ神秘の占い師。運命を導く存在。",
  9: "王国の戦士。忠誠心が厚く、剣を振るい祖国を守る。",
  10: "死してなお、剣を振るう騎士。朽ちた体に宿る忠義。",
  11: "王国の象徴たる高貴な女性。優雅でありながら強い覚悟を持つ。",
  12: "国を治める威厳ある王。民のために決断を下す。",
  13: "強力な魔法を操る者。知識と魔力で戦局を変える。",
  14: "闇の叡智を極めし賢者。禁断の力をその身に宿す。",
  15: "弓を操る狙撃手。遠距離から正確な一撃を放つ。",
  16: "異界から現れた邪悪な存在。人の魂を喰らう。",
  17: "全知全能の存在とされる神。世界を見守る。",
  18: "森の精霊。小さな体に秘めた強大な魔力を持つ。",
  19: "風を纏いし戦士。疾風のごとく戦場を駆け抜ける。",
  20: "氷の力を操る戦士。冷徹な刃で敵を貫く。",
  21: "炎を操る猛き戦士。灼熱の拳で敵を焼き尽くす。",
  22: "世界を支配しようとする闇の支配者。絶対的な力を誇る。",
  23: "聖なる力を宿す騎士。正義の剣で闇を討つ。",
  24: "冥府から蘇った剣士。死を超えた力を持つ。",
  25: "邪悪の化身。絶望と混沌をもたらす存在。",
  26: "天から遣わされた神聖なる使者。秩序と希望を司る。",
  27: "光の力を持つ龍。世界を守る伝説の存在。",
  28: "闇の力を持つ龍。世界を滅ぼす破滅の象徴。",
  29: "闇に堕ちた勇者。かつては正義の象徴だった。",
  30: "伝説に語られる究極の龍。その存在は神話の中にのみ記される。",
};

// レベルに応じて獲得できるなかまかどうかを判定する関数
export const isAcquiredByHeroLevel = (
  memberId: number,
  heroLevel: number
): boolean => {
  // そのメンバーIDに必要なレベルが設定されているか確認
  const requiredLevel = heroLevelAndMemberRelation[memberId];

  // 設定されていない場合、または勇者のレベルが必要レベルに達していない場合はfalse
  if (!requiredLevel || heroLevel < requiredLevel) {
    return false;
  }

  return true;
};

// なかまのモックデータ生成関数
const generateMockMembers = (heroLevel: number = 1): PartyMember[] => {
  return Array(30)
    .fill(null)
    .map((_, index) => {
      const id = index + 1;
      const acquired = isAcquiredByHeroLevel(id, heroLevel);
      return {
        id,
        name: acquired ? customMemberNames[id] : null,
        description: acquired ? customMemberDescriptions[id] : null,
        acquired,
      };
    });
};

// 初期状態では仮のレベル1としてなかまを生成
const initialPartyMembers = generateMockMembers(1);

// エクスポートするモックデータ
export const partyMemberData: PartyData = {
  partyMembers: initialPartyMembers,
};

// レベルに応じてなかまデータを更新する関数
export const updatePartyMembersByLevel = (level: number): PartyMember[] => {
  return generateMockMembers(level);
};
