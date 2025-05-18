"use client";

import React from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";
import styles from "./UserIconButton.module.css";
import Image from "next/image";

interface UserIconButtonProps {
  avatarSize?: string;
  showName?: boolean;
  loaderSize?: string;
  classnameButton?: string;
}

const UserIconButton = ({
  avatarSize = "w-[50px] h-[50px]",
  showName = true,
  loaderSize = "w-[50px] h-[50px]",
  classnameButton = "border-2 border-dashed rounded-full",
}: UserIconButtonProps) => {
  const { isLoaded, userId } = useAuth();
  const { playClickSound } = useClickSound({
    soundPath: "/audio/click-sound_star.mp3",
    volume: 0.5,
  });

  if (!isLoaded) {
    return (
      <div className="grid place-items-center">
        <Loader className={`${loaderSize} animate-spin`} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className={`${styles["not-login-icon-container"]}`}>
        <div className={`${styles["not-login-icon-box"]}`}>
          <Image
            src="/images/icon/mark_question_white.png"
            alt="ログインしていません"
            width={65}
            height={65}
          />
        </div>
        <p className={`${styles["not-login-icon-name"]}`}>???</p>
      </div>
    );
  }

  if (userId) {
    return (
      <button
        onClick={() => playClickSound()}
        className={`${styles["user-button"]}`}
      >
        <UserButton
          appearance={{
            elements: {
              avatarBox: avatarSize,
              userButtonBox: styles["user-button-box"],
              userButtonOuterIdentifier: styles["user-button-name"],
              userButtonAvatarBox:
                styles["user-button-avatar-box"] + " " + classnameButton,
            },
            variables: {
              fontSize: "1rem",
            },
          }}
          showName={showName}
        />
      </button>
    );
  }

  return null;
};

export default UserIconButton;
