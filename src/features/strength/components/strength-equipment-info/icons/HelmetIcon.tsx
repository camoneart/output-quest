"use client";

import React from "react";
import { HardHat } from "@phosphor-icons/react";
import styles from "../StrengthEquipmentInfo.module.css";

interface HelmetIconProps {
  size?: number;
  className?: string;
}

const HelmetIcon: React.FC<HelmetIconProps> = ({ size = 24, className }) => {
  return (
    <HardHat
      className={className || styles["strength-equipment-icon"]}
      size={size}
    />
  );
};

export default HelmetIcon;
