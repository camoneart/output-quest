"use client";

import React, { useState, useEffect } from "react";
import styles from "./StrengthEquipmentList.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WeaponIcon from "../strength-equipment-info/icons/WeaponIcon";
import ShieldIcon from "../strength-equipment-info/icons/ShieldIcon";
import HardHatIcon from "../strength-equipment-info/icons/HelmetIcon";
import ArmorIcon from "../strength-equipment-info/icons/ArmorIcon";
import AccessoryIcon from "../strength-equipment-info/icons/AccessoryIcon";
import { useEquipment } from "@/features/equipment/contexts/EquipmentContext";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import { useUser } from "@clerk/nextjs";

const StrengthEquipmentList = () => {
	const { equipmentState } = useEquipment();
	const { user, isLoaded } = useUser();
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);
	const router = useRouter();

	// ユーザーのZenn連携情報を取得
	useEffect(() => {
		const fetchUserZennInfo = async () => {
			if (!isLoaded) {
				// Clerkの認証状態がまだ確定していない場合は何もしない
				setIsZennInfoLoaded(false);
				return;
			}

			if (!user) {
				// ユーザーがログインしていない場合
				setUserZennInfo(null);
				setIsZennInfoLoaded(true);
				return;
			}

			// ユーザーがログイン済みの場合、Zenn情報を取得
			try {
				const response = await fetch("/api/user");
				const data = await response.json();

				if (data.success && data.user) {
					setUserZennInfo({ zennUsername: data.user.zennUsername });
				} else {
					setUserZennInfo(null);
				}
			} catch (err) {
				console.error("ユーザー情報取得エラー:", err);
				setUserZennInfo(null);
			} finally {
				setIsZennInfoLoaded(true);
			}
		};

		fetchUserZennInfo();
	}, [isLoaded, user]);

	// ロード中の判定
	const isLoading = !isLoaded || (user && !isZennInfoLoaded);

	// ゲストユーザーかどうかの判定（Clerkサインイン + Zenn連携の両方が必要）
	const isGuestUser = !user || !userZennInfo?.zennUsername;

	const getEquipmentName = (type: string) => {
		const equipment = equipmentState[type as keyof typeof equipmentState];
		return equipment?.name || "そうびなし";
	};

	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190, // 190ミリ秒 = 0.19秒の遅延
	});

	// 装備タイプの配列
	const equipmentTypes = [
		{ type: "weapon", icon: WeaponIcon, label: "weapon" },
		{ type: "shield", icon: ShieldIcon, label: "shield" },
		{ type: "helmet", icon: HardHatIcon, label: "helmet" },
		{ type: "armor", icon: ArmorIcon, label: "armor" },
		{ type: "accessory", icon: AccessoryIcon, label: "accessory" },
	];

	// 遅延付きページ遷移の処理
	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	// ロード中の場合は読み込み中UIを表示
	if (isLoading) {
		return (
			<div className={styles["strength-equipment-list-box"]}>
				<p className="text-sm grid place-items-center h-full border-2 rounded-[3px] bg-[#1a1a1a] px-[10px] py-[40px]">
					読み込み中...
				</p>
			</div>
		);
	}

	return (
		<div className={styles["strength-equipment-list-box"]}>
			{isGuestUser ? (
				<p className="text-sm grid place-items-center h-full border-2 rounded-[3px] bg-[#1a1a1a] px-[10px] py-[40px]">
					ログインすると利用できる機能です
				</p>
			) : (
				<ul className={styles["strength-equipment-list"]}>
					{equipmentTypes.map((equipment) => {
						const Icon = equipment.icon;
						return (
							<li
								key={equipment.type}
								className={styles["strength-equipment-item"]}
							>
								<Link
									href={`/equipment/${equipment.type}`}
									className={styles["strength-equipment-item-link"]}
									onClick={(e) =>
										handleNavigation(e, `/equipment/${equipment.type}`)
									}
								>
									<div
										className={`${styles["strength-equipment-icon-box"]} ${
											styles[`strength-equipment-icon-box-${equipment.type}`]
										}`}
									>
										<Icon
											className={styles["strength-equipment-icon"]}
											size={24}
										/>
									</div>
									<h3 className={styles["strength-equipment-item-link-text"]}>
										{getEquipmentName(equipment.type)}
									</h3>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default StrengthEquipmentList;
