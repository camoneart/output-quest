import React, { memo } from "react";
import styles from "./ConnectionZennForm.module.css";
import Image from "next/image";

interface ConnectionZennFormProps {
	zennUsername: string;
	loading: boolean;
	error: string;
	onUsernameChange: (value: string) => void;
	onSubmit: () => void;
	isZennInfoLoaded?: boolean;
}

const ConnectionZennForm = memo<ConnectionZennFormProps>(
	function ConnectionZennForm({
		zennUsername,
		loading,
		error,
		onUsernameChange,
		onSubmit,
		isZennInfoLoaded = true,
	}) {
		return (
			<div className={`grid grid-cols-1 gap-2 ${styles["zenn-connect-area"]}`}>
				<label htmlFor="zenn-username" className={`text-sm ${styles["zenn-username"]}`}>
					<Image
						src="/images/connection/connection-zenn-logo.svg"
						alt="Zenn"
						width={16}
						height={16}
						className={styles["zenn-logo-sm"]}
					/>
					<span>Zennユーザー名</span>
					<strong className="text-[#ffc630]">(必須)</strong>
				</label>
				<div className="flex gap-3">
					<input
						id="zenn-username"
						type="text"
						value={zennUsername}
						onChange={(e) => onUsernameChange(e.target.value)}
						className="flex-1 border-[3px] border-gray-400 bg-white rounded px-3 py-2 text-black"
						placeholder="例: aoyamadev"
						disabled={loading}
					/>
					<button
						onClick={onSubmit}
						className={`${styles["connect-button"]} ${
							!loading && zennUsername ? styles["active"] : ""
						} ${
							loading || !zennUsername
								? "opacity-50 cursor-not-allowed"
								: "cursor-pointer"
						}`}
						disabled={loading || !zennUsername}
					>
						<div className={`${styles["connect-button-content"]}`}>連携</div>
					</button>
				</div>
				{error ? (
					""
				) : (
					<p className="text-center mt-[12px]">
						{loading && isZennInfoLoaded
							? "連携中..."
							: "Zennと連携が必要です。"}
					</p>
				)}
			</div>
		);
	}
);

export default ConnectionZennForm;
