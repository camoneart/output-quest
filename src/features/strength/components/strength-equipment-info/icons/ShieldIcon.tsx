"use client";

import React from "react";
import { ShieldChevron } from "@phosphor-icons/react";
import styles from "../StrengthEquipmentInfo.module.css";

interface ShieldIconProps {
  size?: number;
  className?: string;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({ size = 24, className }) => {
  return (
    <ShieldChevron
      className={className || styles["strength-equipment-icon"]}
      size={size}
    />
  );
};

export default ShieldIcon;
