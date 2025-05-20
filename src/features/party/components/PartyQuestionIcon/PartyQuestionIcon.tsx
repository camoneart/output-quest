import React from "react";
import Image from "next/image";

interface TreasureChestProps {
  className?: string;
  width?: number;
  height?: number;
}

const PartyQuestionIcon: React.FC<TreasureChestProps> = ({
  width = 35,
  height = 35,
  className,
}) => {
  return (
    <Image
      src="/images/party-page/unacquired-icon/mark_question.svg"
      alt="未獲得のなかま"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default PartyQuestionIcon;
