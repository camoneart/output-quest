import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // サーバーサイドレンダリング時は初期値のみを使用
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // マウント後にクライアントサイドでlocalStorageから値を読み込む
  // クライアントサイドのみで実行
  useEffect(() => {
    // サーバーサイドレンダリング時は実行しない
    if (typeof window === "undefined") return;

    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // アイテムがない場合は初期値を設定
        localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(error);
      // パースエラーの場合は初期値を使用
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }, [key, initialValue]);

  // 値を設定する関数
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      // 新しい値を状態に設定
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // サーバーサイドレンダリング時は実行しない
      if (typeof window !== "undefined") {
        // ローカルストレージに保存
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
