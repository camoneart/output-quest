"use client";

import React, { createContext, use, ReactNode, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useUser } from "@clerk/nextjs";

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
	resetEquipment: () => void;
};

// Contextの作成
const EquipmentContext = createContext<EquipmentContextType | undefined>(
	undefined
);

// Providerコンポーネント
export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
	const { user, isLoaded } = useUser();
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

	// 装備のリセット
	const resetEquipment = () => {
		setEquipmentState(initialEquipmentState);
		// localStorageからも削除
		if (typeof window !== "undefined") {
			localStorage.removeItem("equippedItems");
		}
	};

	// ユーザーの認証状態を監視
	useEffect(() => {
		if (isLoaded && !user) {
			// ユーザーがサインアウトした場合、装備をリセット
			setEquipmentState(initialEquipmentState);
			// localStorageからも削除
			if (typeof window !== "undefined") {
				localStorage.removeItem("equippedItems");
			}
		}
	}, [user, isLoaded, setEquipmentState]);

	return (
		<EquipmentContext
			value={{
				equipmentState,
				equipItem,
				unequipItem,
				resetEquipment,
			}}
		>
			{children}
		</EquipmentContext>
	);
};

// カスタムフック
export const useEquipment = () => {
	const context = use(EquipmentContext);
	if (context === undefined) {
		throw new Error("useEquipment must be used within an EquipmentProvider");
	}
	return context;
};
