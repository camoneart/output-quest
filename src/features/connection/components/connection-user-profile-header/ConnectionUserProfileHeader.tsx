import React from "react";
import { UserResource } from "@clerk/types";
import styles from "./ConnectionUserProfileHeader.module.css";
import UserIconButton from "@/components/auth/user-icon-button/UserIconButton";

interface ConnectionUserProfileHeaderProps {
  user: UserResource;
}

const ConnectionUserProfileHeader: React.FC<ConnectionUserProfileHeaderProps> = ({ user }) => {
  return (
    <div className={styles["profile-info-header"]}>
      {user.id && (
        <UserIconButton
          avatarSize="w-[75px] h-[75px] md:w-[95px] md:h-[95px]"
          showName={false}
          loaderSize="w-[75px] h-[75px] md:w-[95px] md:h-[95px]"
          classnameButton=""
        />
      )}

      <div className="grid grid-cols-1 gap-1 place-items-center sm:place-items-start">
        <h2 className="text-xl font-bold tracking-wide">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm tracking-wide">
          {user.emailAddresses[0].emailAddress}
        </p>
      </div>
    </div>
  );
};

export default ConnectionUserProfileHeader;
