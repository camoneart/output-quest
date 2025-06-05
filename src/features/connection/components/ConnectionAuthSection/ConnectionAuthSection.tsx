import React from "react";
import styles from "./ConnectionAuthSection.module.css";
import AuthButton from "@/components/auth/AuthButton/AuthButton";

interface ConnectionAuthSectionProps {
  loading: boolean;
  zennUsername: string;
  updateUserProfile: () => void;
}

const ConnectionAuthSection: React.FC<ConnectionAuthSectionProps> = ({
  loading,
  zennUsername,
  updateUserProfile,
}) => {
  return (
    <div className={`px-4 py-6 grid gap-8 ${styles["connection-container"]}`}>
      <div className={`${styles["auth-content"]}`}>
        <AuthButton />
        <p className="text-center">
          アプリを利用するには「ログイン」または「新規登録」が必要です。
        </p>
      </div>
      <hr className={styles["center-line"]} />
      <div className={`grid grid-cols-1 gap-2 ${styles["zenn-connect-area"]}`}>
        <label
          htmlFor="zenn-username"
          className="text-sm opacity-40 select-none"
        >
          Zennユーザー名
          <strong className="text-[#ffc630]">（必須）</strong>
        </label>
        <div className="flex gap-3 opacity-40 select-none">
          <input
            id="zenn-username"
            type="text"
            value=""
            onChange={() => {}}
            className="flex-1 border-[3px] border-gray-400 bg-white rounded px-3 py-2 text-black cursor-not-allowed"
            placeholder="例: aoyamadev"
            disabled
          />
          <button
            onClick={() => updateUserProfile()}
            className={`${styles["connect-button"]} ${
              !loading && zennUsername ? styles["active"] : ""
            } ${
              loading || !zennUsername
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={loading || !zennUsername}
          >
            <div className={`${styles["connect-button-content"]}`}>
              {loading ? "連携中..." : "連携"}
            </div>
          </button>
        </div>
        <p className="text-center mt-[12px]">
          先に「ログイン」または「新規登録」を完了してください。
        </p>
      </div>
    </div>
  );
};

export default ConnectionAuthSection;
