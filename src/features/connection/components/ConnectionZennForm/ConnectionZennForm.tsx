import React, { memo } from "react";
import styles from "./ConnectionZennForm.module.css";

interface ConnectionZennFormProps {
	zennUsername: string;
	loading: boolean;
	error: string;
	onUsernameChange: (value: string) => void;
	onSubmit: () => void;
	isZennInfoLoaded?: boolean;
	isAuthenticated?: boolean;
}

const ConnectionZennForm = memo<ConnectionZennFormProps>(
	function ConnectionZennForm({
		zennUsername,
		loading,
		error,
		onUsernameChange,
		onSubmit,
		isZennInfoLoaded = true,
		isAuthenticated = false,
	}) {
		return (
			<div className={`grid grid-cols-1 gap-2 ${styles["zenn-connect-area"]}`}>
				<label
					htmlFor="zenn-username"
					className={`text-sm ${!isAuthenticated ? "opacity-40 select-none" : ""}`}
				>
					Zennユーザー名
					<strong className="text-[#ffc630]">（必須）</strong>
				</label>
				<div
					className={`flex gap-3 ${!isAuthenticated ? "opacity-40 select-none" : ""}`}
				>
					<input
						id="zenn-username"
						type="text"
						value={isAuthenticated ? zennUsername : ""}
						onChange={
							isAuthenticated
								? (e) => onUsernameChange(e.target.value)
								: () => {}
						}
						className="flex-1 border-[3px] border-gray-400 bg-white rounded px-3 py-2 text-black"
						placeholder="例: aoyamadev"
						disabled={loading || !isAuthenticated}
					/>
					<button
						onClick={onSubmit}
						className={`${styles["connect-button"]} ${
							!loading && zennUsername && isAuthenticated
								? styles["active"]
								: ""
						} ${
							loading || !zennUsername || !isAuthenticated
								? "opacity-50 cursor-not-allowed"
								: "cursor-pointer"
						}`}
						disabled={loading || !zennUsername || !isAuthenticated}
					>
						<div className={`${styles["connect-button-content"]}`}>連携</div>
					</button>
				</div>
				{error ? (
					""
				) : (
					<p className="text-center mt-[12px]">
						{!isAuthenticated
							? "先に「ログイン」または「新規登録」を完了してください。"
							: loading && isZennInfoLoaded
								? "連携中..."
								: "Zennと連携が必要です。"}
					</p>
				)}
			</div>
		);
	}
);

export default ConnectionZennForm;
