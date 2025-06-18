"use client";

import React from "react";
import { Sword } from "@phosphor-icons/react";
import styles from "../StrengthEquipmentInfo.module.css";

interface WeaponIconProps {
  size?: number;
  className?: string;
}

const WeaponIcon: React.FC<WeaponIconProps> = ({ size = 24, className }) => {
  return (
    <Sword
      className={className || styles["strength-equipment-icon"]}
      size={size}
    />
  );
};

export default WeaponIcon;
