"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useClickSound } from "@/components/common/Audio/ClickSound/ClickSound";

interface XShareButtonProps {
	level: number;
	username: string;
	className?: string;
	iconClassName?: string;
	textClassName?: string;
	iconWidth?: number;
	iconHeight?: number;
	showText?: boolean;
	customText?: string;
	customShareText?: string;
	isGuestUser?: boolean;
}

const XShareButton: React.FC<XShareButtonProps> = ({
	level,
	username,
	className = "",
	iconClassName = "",
	textClassName = "",
	iconWidth = 40,
	iconHeight = 40,
	showText = true,
	customText,
	customShareText,
	isGuestUser = false,
}) => {
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_star.mp3",
		volume: 0.5,
		delay: 190,
	});

	const handleXShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		// ゲストユーザーの場合は制限メッセージを表示
		if (isGuestUser) {
			playClickSound(() => {
				window.confirm("ゲストユーザー様はご利用いただけない機能です。");
			});
			return;
		}

		// 認証済みユーザーの場合は通常のシェア処理
		playClickSound(() => {
			// カスタムシェアテキストがある場合はそれを使用、なければデフォルト
			const shareText =
				customShareText ||
				`【レベルアップ！】\n⭐️ 学びの勇者は レベル${level}に上がった！\n\n新感覚学習RPG：「OUTPUT QUEST ~ 叡智の継承者 ~」で学びの冒険を いま、始めよう！\n\n#OUTPUTQUEST #叡智の継承者\n\n@bojjidev\n`;

			const shareUrl = `https://x.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://outputquest.com")}`;

			// 新しいタブでXのシェア画面を開く
			window.open(shareUrl, "_blank", "noopener,noreferrer");
		});
	};

	const displayText = customText || "現在のレベルをXでシェアする";

	return (
		<Link href="#" onClick={handleXShare} className={className}>
			<Image
				src="/images/sns/x-icon.svg"
				alt="Xのアイコン"
				width={iconWidth}
				height={iconHeight}
				className={iconClassName}
			/>
			{showText && <span className={textClassName}>{displayText}</span>}
		</Link>
	);
};

export default XShareButton;
