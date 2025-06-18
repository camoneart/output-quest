"use client";

import React from "react";
import { GiGlobeRing } from "react-icons/gi";
import styles from "../StrengthEquipmentInfo.module.css";

interface AccessoryIconProps {
  size?: number;
  className?: string;
}

const AccessoryIcon: React.FC<AccessoryIconProps> = ({ size = 24, className }) => {
  return (
    <GiGlobeRing
      className={className || styles["strength-equipment-icon"]}
      size={size}
    />
  );
};

export default AccessoryIcon;
