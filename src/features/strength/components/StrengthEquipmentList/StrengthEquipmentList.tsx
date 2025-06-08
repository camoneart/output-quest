"use client";

import React from "react";
import styles from "./StrengthEquipmentList.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WeaponIcon from "../StrengthEquipmentInfo/icons/WeaponIcon";
import ShieldIcon from "../StrengthEquipmentInfo/icons/ShieldIcon";
import HardHatIcon from "../StrengthEquipmentInfo/icons/HelmetIcon";
import ArmorIcon from "../StrengthEquipmentInfo/icons/ArmorIcon";
import AccessoryIcon from "../StrengthEquipmentInfo/icons/AccessoryIcon";
import { useEquipment } from "@/features/equipment/contexts/EquipmentContext";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

const StrengthEquipmentList = () => {
  const { equipmentState } = useEquipment();
  const router = useRouter();

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

  return (
    <div className={styles["strength-equipment-list-box"]}>
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
    </div>
  );
};

export default StrengthEquipmentList;
