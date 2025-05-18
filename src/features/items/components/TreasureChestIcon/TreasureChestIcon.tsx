import React from "react";
import Image from "next/image";

interface TreasureChestProps {
  className?: string;
  width?: number;
  height?: number;
}

const TreasureChestIcon: React.FC<TreasureChestProps> = ({
  width = 40,
  height = 40,
  className,
}) => {
  return (
    <Image
      src="/images/items-page/unacquired-icon/treasure-chest.svg"
      alt="未獲得のアイテム"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default TreasureChestIcon;
