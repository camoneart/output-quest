import React from "react";
import Image from "next/image";

interface ItemsTreasureChestProps {
  className?: string;
  width?: number;
  height?: number;
}

const ItemsTreasureChestIcon: React.FC<ItemsTreasureChestProps> = ({
  width = 40,
  height = 40,
  className,
}) => {
  return (
    <Image
      src="/images/items-page/unacquired-icon/treasure-chest.svg"
      alt="未入手のアイテム"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default ItemsTreasureChestIcon;
