import { ItemsData } from "../types/items.types";
import { itemsData } from "../data/itemsData";

/**
 * アイテムデータを取得する関数
 * 現在はモックデータを返しますが、将来的にはAPIからデータを取得するように変更予定
 */
export async function fetchItemsData(): Promise<ItemsData> {
  // TODO: 実際のAPIが実装されたら、ここでフェッチ処理を行う
  // 例:
  // try {
  //   const response = await fetch("/api/items");
  //   if (!response.ok) {
  //     throw new Error("アイテムデータの取得に失敗しました");
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error("アイテムデータの取得エラー:", error);
  //   // エラー時にはモックデータを返す
  //   return itemsData;
  // }

  // 現時点ではモックデータを返す
  return Promise.resolve(itemsData);
}
