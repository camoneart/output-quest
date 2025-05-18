"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// 装備品の型定義
type EquipmentItem = {
  id: number;
  name: string;
  type: string;
};

// 装備状態の型定義
type EquipmentState = {
  weapon: EquipmentItem | null;
  shield: EquipmentItem | null;
  helmet: EquipmentItem | null;
  armor: EquipmentItem | null;
  accessory: EquipmentItem | null;
};

// 初期状態
const initialEquipmentState: EquipmentState = {
  weapon: null,
  shield: null,
  helmet: null,
  armor: null,
  accessory: null,
};

// Contextの型定義
type EquipmentContextType = {
  equipmentState: EquipmentState;
  equipItem: (item: EquipmentItem) => void;
  unequipItem: (type: keyof EquipmentState) => void;
};

// Contextの作成
const EquipmentContext = createContext<EquipmentContextType | undefined>(
  undefined
);

// Providerコンポーネント
export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentState, setEquipmentState] = useLocalStorage<EquipmentState>(
    "equippedItems", // 装備品の状態を保存するためのキー
    initialEquipmentState // 初期状態（null）
  );

  // 装備品の装備
  const equipItem = (item: EquipmentItem) => {
    setEquipmentState((prev) => ({
      ...prev,
      [item.type]: item,
    }));
  };

  // 装備品の解除
  const unequipItem = (type: keyof EquipmentState) => {
    setEquipmentState((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipmentState,
        equipItem,
        unequipItem,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

// カスタムフック
export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error("useEquipment must be used within an EquipmentProvider");
  }
  return context;
};
