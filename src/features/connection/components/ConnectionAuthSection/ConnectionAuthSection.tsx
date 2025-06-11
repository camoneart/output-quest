import React from "react";
import styles from "./ConnectionAuthSection.module.css";
import AuthButton from "@/components/auth/AuthButton/AuthButton";
import Link from "next/link";
import Image from "next/image";

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
		<div
			className={`px-4 pt-3 pb-6 grid gap-8 ${styles["connection-container"]}`}
		>
			<div className={`${styles["auth-content"]}`}>
				<AuthButton />
				<div className="grid grid-cols-1 gap-[32px]">
					<p className="text-center text-base flex ">
						<em className={styles["zenn-emphasis"]}>
							<Image
								src="/images/nav-icon/zenn-logo.svg"
								alt="Zenn"
								width={18}
								height={18}
								className={styles["zenn-logo"]}
							/>
							<span>Zennとの連携</span>
						</em>
						<span>には「ログイン」または「新規登録」が必要です。</span>
					</p>
					<div className="grid grid-cols-1 gap-2 place-items-center">
						<em className="text-center text-sm not-italic">
							※「ログイン」「新規登録」無しでも、ご利用いただけます。
						</em>
						<Link
							href="/connection-detail"
							className={styles["connection-detail-link"]}
						>
							詳細はこちら
						</Link>
					</div>
				</div>
			</div>
			<hr className={styles["center-line"]} />
			<div className={`grid grid-cols-1 gap-2 ${styles["zenn-connect-area"]}`}>
				<label
					htmlFor="zenn-username"
					className={`text-sm opacity-40 select-none ${styles["zenn-username"]}`}
				>
					<Image
						src="/images/nav-icon/zenn-logo.svg"
						alt="Zenn"
						width={16}
						height={16}
						className={styles["zenn-logo-sm"]}
					/>
					<span>Zennユーザー名</span>
					<strong className="text-[#ffc630]">(必須)</strong>
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
				<p className="text-center text-base mt-[12px]">
					先に「ログイン」または「新規登録」を完了してください。
				</p>
			</div>
		</div>
	);
};

export default ConnectionAuthSection;
