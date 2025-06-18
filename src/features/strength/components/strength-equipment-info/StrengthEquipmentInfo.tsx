import React from "react";
import styles from "./StrengthEquipmentInfo.module.css";
import * as Strength from "@/features/strength/components/index";

const StrengthEquipmentInfo = () => {
  return (
    <div className={styles["strength-equipment-info"]}>
      <div className={styles["strength-equipment-info-content"]}>
        <div className={styles["strength-equipment-box"]}>
          <h2 className={styles["strength-equipment-title"]}>~ そうび ~</h2>
          <Strength.StrengthEquipmentList />
        </div>
      </div>
    </div>
  );
};

export default StrengthEquipmentInfo;
