import styles from "./LoadingIndicator.module.css";

interface LoadingIndicatorProps {
	text?: string;
	className?: string;
	fontSize?: string;
}

/**
 * LoadingIndicator
 *
 * アニメーション付きのローディングインジケーター
 * ドット3つが波のように順番に点滅する視覚効果を提供
 *
 * @param text - 表示するテキスト（デフォルト: "読み込み中"）
 * @param className - 追加のCSSクラス名
 * @param fontSize - フォントサイズ（例: "1rem", "16px"）
 */
const LoadingIndicator = ({
	text = "読み込み中",
	className = "",
	fontSize
}: LoadingIndicatorProps) => {
	return (
		<div
			className={`${styles["loading-indicator"]} ${className}`}
			style={fontSize ? { fontSize } : undefined}
		>
			<div className={styles["loading-indicator-text"]}>{text}</div>
			<span className={styles["loading-dots"]}>
				<span className={styles["loading-dot"]}>.</span>
				<span className={styles["loading-dot"]}>.</span>
				<span className={styles["loading-dot"]}>.</span>
			</span>
		</div>
	);
};

export default LoadingIndicator;
