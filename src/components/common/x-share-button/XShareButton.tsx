"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";

interface XShareButtonProps {
	level: number;
	username?: string;
	className?: string;
	iconClassName?: string;
	iconWrapClassName?: string;
	textClassName?: string;
	iconWidth?: number;
	iconHeight?: number;
	showText?: boolean;
	customText?: string;
	customShareText?: string;
	isGuestUser?: boolean;
	hasContent?: boolean;
	noContentMessage?: string;
}

const XShareButton: React.FC<XShareButtonProps> = ({
	level,
	username = "",
	className = "",
	iconClassName = "",
	iconWrapClassName = "",
	textClassName = "",
	iconWidth = 40,
	iconHeight = 40,
	showText = true,
	customText,
	customShareText,
	isGuestUser = false,
	hasContent = true,
	noContentMessage = "コンテンツがありません",
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

		// コンテンツがない場合は制限メッセージを表示
		if (!hasContent) {
			playClickSound(() => {
				window.confirm(noContentMessage);
			});
			return;
		}

		// 認証済みユーザーでコンテンツがある場合は通常のシェア処理
		playClickSound(() => {
			// 共通のテンプレート文
			const commonTemplate = `───\n\n新感覚学習RPG：「OUTPUT QUEST ~ 叡智の継承者 ~」で、勇者を育てる学びの冒険をいま、始めよう！\n\n#OUTPUTQUEST #叡智の継承者\n#OUTPUTQUESTシェアポスト\n\n`;

			// カスタムシェアテキストがある場合はそれを使用、なければデフォルト
			const shareText = customShareText
				? `${customShareText}${commonTemplate}`
				: `【レベルアップ！】\n⭐️ 勇者は レベル${level}に上がった！\n\n${commonTemplate}`;

			const shareUrl = `https://x.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://outputquest.com")}`;

			// 新しいタブでXのシェア画面を開く
			window.open(shareUrl, "_blank", "noopener,noreferrer");
		});
	};

	const displayText = customText || "現在のレベルをXでシェアする";

	return (
		<Link href="#" onClick={handleXShare} className={className}>
			<figure className={iconWrapClassName}>
				<Image
					src="/images/sns/x-icon.svg"
					alt="Xのアイコン"
					width={iconWidth}
					height={iconHeight}
					className={iconClassName}
					priority={true}
				/>
			</figure>
			{showText && <span className={textClassName}>{displayText}</span>}
		</Link>
	);
};

export default XShareButton;
