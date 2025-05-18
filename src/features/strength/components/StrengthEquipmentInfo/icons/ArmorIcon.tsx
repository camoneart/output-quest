"use client";

import React from "react";
import { TShirt } from "@phosphor-icons/react";
import styles from "../StrengthEquipmentInfo.module.css";

interface ArmorIconProps {
  size?: number;
  className?: string;
}

const ArmorIcon: React.FC<ArmorIconProps> = ({ size = 24, className }) => {
  return (
    <TShirt
      className={className || styles["strength-equipment-icon"]}
      size={size}
    />
  );
};

export default ArmorIcon;
