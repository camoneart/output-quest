"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useHero } from "@/contexts/HeroContext";
import {
	isAcquiredByHeroLevel,
	customMemberNames,
	customMemberDescriptions,
} from "@/features/party/data/partyMemberData";

interface PartyMemberDynamicHeadProps {
	partyId: number;
}

/**
 * 動的にHeadタグを更新するコンポーネント
 * サーバーサイドで生成されたメタデータの上に、クライアントサイドでレンダリングされる際に
 * 実際の勇者レベルと認証状態、Zenn連携状態に基づいて適切なタイトルと説明を設定する
 */
const PartyMemberDynamicHead: React.FC<PartyMemberDynamicHeadProps> = ({
	partyId,
}) => {
	const { user, isLoaded } = useUser();
	const { heroData, isLoading } = useHero();
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const [isZennInfoLoaded, setIsZennInfoLoaded] = useState(false);

	// ユーザーのZenn連携情報を取得
	useEffect(() => {
		const fetchUserZennInfo = async () => {
			if (!isLoaded) {
				setIsZennInfoLoaded(false);
				return;
			}

			if (!user) {
				setUserZennInfo(null);
				setIsZennInfoLoaded(true);
				return;
			}

			setIsZennInfoLoaded(false);

			try {
				const userRes = await fetch("/api/user");
				const userData = await userRes.json();

				if (userData.success) {
					setUserZennInfo(userData.user);
				} else {
					setUserZennInfo(null);
				}
			} catch (err) {
				console.error("ユーザー情報取得エラー:", err);
				setUserZennInfo(null);
			} finally {
				setIsZennInfoLoaded(true);
			}
		};

		fetchUserZennInfo();
	}, [isLoaded, user?.id]);

	useEffect(() => {
		// ロード中は何もしない
		if (isLoading || !isLoaded || !isZennInfoLoaded) return;

		// ドキュメントのheadタグを取得
		const titleElement = document.querySelector("title");
		const descriptionMeta = document.querySelector('meta[name="description"]');

		// OpenGraph メタデータ
		const ogTitleMeta = document.querySelector('meta[property="og:title"]');
		const ogDescriptionMeta = document.querySelector(
			'meta[property="og:description"]'
		);
		const ogImageMeta = document.querySelector('meta[property="og:image"]');
		const ogImageAltMeta = document.querySelector(
			'meta[property="og:image:alt"]'
		);

		// Twitter Card メタデータ
		const twitterTitleMeta = document.querySelector(
			'meta[name="twitter:title"]'
		);
		const twitterDescriptionMeta = document.querySelector(
			'meta[name="twitter:description"]'
		);
		const twitterImageMeta = document.querySelector(
			'meta[name="twitter:image"]'
		);
		const twitterImageAltMeta = document.querySelector(
			'meta[name="twitter:image:alt"]'
		);

		// ゲストユーザーまたはZenn未連携ユーザーの場合はゲスト用メタデータを表示
		const isGuestUser = !user || !userZennInfo?.zennUsername;

		if (isGuestUser) {
			const guestTitle = "まだ見ぬ仲間";
			const guestDescription =
				"ログインすると勇者の仲間に加わったキャラクターの詳細情報がここに表示されます。";
			const guestOgTitle = `${guestTitle}｜OUTPUT QUEST`;
			const guestImageUrl =
				"/images/party-page/unacquired-icon/mark_question.svg";

			// 基本メタデータ
			if (titleElement)
				titleElement.textContent = `${guestTitle}｜OUTPUT QUEST`;
			if (descriptionMeta)
				descriptionMeta.setAttribute("content", guestDescription);

			// OpenGraph メタデータ
			if (ogTitleMeta) ogTitleMeta.setAttribute("content", guestOgTitle);
			if (ogDescriptionMeta)
				ogDescriptionMeta.setAttribute("content", guestDescription);
			if (ogImageMeta)
				ogImageMeta.setAttribute(
					"content",
					`${window.location.origin}${guestImageUrl}`
				);
			if (ogImageAltMeta) ogImageAltMeta.setAttribute("content", guestTitle);

			// Twitter Card メタデータ
			if (twitterTitleMeta)
				twitterTitleMeta.setAttribute("content", guestOgTitle);
			if (twitterDescriptionMeta)
				twitterDescriptionMeta.setAttribute("content", guestDescription);
			if (twitterImageMeta)
				twitterImageMeta.setAttribute(
					"content",
					`${window.location.origin}${guestImageUrl}`
				);
			if (twitterImageAltMeta)
				twitterImageAltMeta.setAttribute("content", guestTitle);

			return;
		}

		// Zenn連携済みユーザーの場合は勇者のレベルに基づいて仲間の獲得状態を判定
		const isAcquired = isAcquiredByHeroLevel(partyId, heroData.level);

		if (isAcquired) {
			// 獲得済みの場合は、仲間の名前と説明を表示
			const memberName = customMemberNames[partyId];
			const memberDescription = customMemberDescriptions[partyId];
			const memberOgTitle = `${memberName}｜なかま詳細`;
			const memberImageUrl = `/images/party-page/acquired-icon/party-member-${partyId}.svg`;

			// 基本メタデータ
			if (titleElement)
				titleElement.textContent = `${memberName}｜OUTPUT QUEST`;
			if (descriptionMeta)
				descriptionMeta.setAttribute("content", memberDescription);

			// OpenGraph メタデータ
			if (ogTitleMeta) ogTitleMeta.setAttribute("content", memberOgTitle);
			if (ogDescriptionMeta)
				ogDescriptionMeta.setAttribute("content", memberDescription);
			if (ogImageMeta)
				ogImageMeta.setAttribute(
					"content",
					`${window.location.origin}${memberImageUrl}`
				);
			if (ogImageAltMeta) ogImageAltMeta.setAttribute("content", memberName);

			// Twitter Card メタデータ
			if (twitterTitleMeta)
				twitterTitleMeta.setAttribute("content", memberOgTitle);
			if (twitterDescriptionMeta)
				twitterDescriptionMeta.setAttribute("content", memberDescription);
			if (twitterImageMeta)
				twitterImageMeta.setAttribute(
					"content",
					`${window.location.origin}${memberImageUrl}`
				);
			if (twitterImageAltMeta)
				twitterImageAltMeta.setAttribute("content", memberName);
		} else {
			// 未獲得の場合は、未獲得のメッセージを表示
			const unacquiredTitle = "まだ見ぬ仲間";
			const requiredLevelElement = document.querySelector(
				'meta[name="requiredLevel"]'
			);
			const requiredLevel = requiredLevelElement
				? requiredLevelElement.getAttribute("content")
				: partyId;
			const unacquiredDescription = `このキャラはLv${requiredLevel}で仲間に加わるぞ！冒険を続けて勇者のレベルを上げましょう！`;
			const unacquiredOgTitle = `${unacquiredTitle}｜なかま詳細`;
			const unacquiredImageUrl =
				"/images/party-page/unacquired-icon/mark_question.svg";

			// 基本メタデータ
			if (titleElement)
				titleElement.textContent = `${unacquiredTitle}｜OUTPUT QUEST`;
			if (descriptionMeta)
				descriptionMeta.setAttribute("content", unacquiredDescription);

			// OpenGraph メタデータ
			if (ogTitleMeta) ogTitleMeta.setAttribute("content", unacquiredOgTitle);
			if (ogDescriptionMeta)
				ogDescriptionMeta.setAttribute("content", unacquiredDescription);
			if (ogImageMeta)
				ogImageMeta.setAttribute(
					"content",
					`${window.location.origin}${unacquiredImageUrl}`
				);
			if (ogImageAltMeta)
				ogImageAltMeta.setAttribute("content", unacquiredTitle);

			// Twitter Card メタデータ
			if (twitterTitleMeta)
				twitterTitleMeta.setAttribute("content", unacquiredOgTitle);
			if (twitterDescriptionMeta)
				twitterDescriptionMeta.setAttribute("content", unacquiredDescription);
			if (twitterImageMeta)
				twitterImageMeta.setAttribute(
					"content",
					`${window.location.origin}${unacquiredImageUrl}`
				);
			if (twitterImageAltMeta)
				twitterImageAltMeta.setAttribute("content", unacquiredTitle);
		}
	}, [
		partyId,
		heroData.level,
		isLoading,
		user,
		isLoaded,
		userZennInfo,
		isZennInfoLoaded,
	]);

	return null; // 何もレンダリングしない
};

export default PartyMemberDynamicHead;
