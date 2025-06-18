"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./PartyMemberCardList.module.css";
import Image from "next/image";
import * as Party from "@/features/party/components/index";
import { updatePartyMembersByLevel } from "@/features/party/data/partyMemberData";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import { fetchZennArticles } from "@/features/posts/services";
import { PartyMember } from "@/features/party/types/party.types";
import { useUser } from "@clerk/nextjs";

const PartyMemberCardList: React.FC = () => {
	const [members, setMembers] = useState<PartyMember[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [userZennInfo, setUserZennInfo] = useState<{
		zennUsername?: string;
	} | null>(null);
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	// ゲストユーザーかどうかの判定（Clerkサインイン + Zenn連携の両方が必要）
	const isGuestUser = !isLoaded || !user || !userZennInfo?.zennUsername;

	// ユーザーのZenn連携情報を取得
	useEffect(() => {
		const fetchUserZennInfo = async () => {
			if (!isLoaded || !user) {
				setUserZennInfo(null);
				return;
			}

			try {
				const response = await fetch("/api/user");
				const data = await response.json();

				if (data.success && data.user) {
					setUserZennInfo({ zennUsername: data.user.zennUsername });
				} else {
					setUserZennInfo(null);
				}
			} catch (err) {
				console.error("ユーザー情報取得エラー:", err);
				setUserZennInfo(null);
			}
		};

		fetchUserZennInfo();
	}, [isLoaded, user]);

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				setIsLoading(true);
				const userRes = await fetch("/api/user");
				const userData = await userRes.json();
				if (!userData.success) {
					throw new Error("ユーザー情報の取得に失敗しました");
				}
				const username = userData.user.zennUsername || "aoyamadev";

				const articles = await fetchZennArticles(username, { fetchAll: true });
				const articleCount = articles.length;
				const updatedMembers = updatePartyMembersByLevel(articleCount);
				setMembers(updatedMembers);
			} catch (err) {
				console.error("仲間データ取得エラー:", err);
				setError(
					err instanceof Error
						? err.message
						: "仲間データの取得に失敗しました。"
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchMembers();
	}, []);

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

	if (isLoading) {
		return (
			<div className={styles["party-loading-indicator"]}>読み込み中...</div>
		);
	}
	if (error) {
		return <p className={styles["error-message"]}>{error}</p>;
	}

	return (
		<div className={styles["party-grid"]}>
			{members.map((partyMember) => (
				<div
					className={styles["party-member-card-content"]}
					key={partyMember.id}
				>
					<Link
						href={`/party/${partyMember.id}`}
						className={styles["party-member-card"]}
						onClick={(e) => handleNavigation(e, `/party/${partyMember.id}`)}
					>
						{isGuestUser ? (
							<div className={styles["unacquired-party-member-icon"]}>
								<Party.PartyQuestionIcon
									width={40}
									height={40}
									className={styles["unacquired-party-member-icon-image"]}
								/>
							</div>
						) : partyMember.acquired ? (
							<div className={styles["acquired-party-member-icon"]}>
								<Image
									src={`/images/party-page/acquired-icon/party-member-${partyMember.id}.svg`}
									alt={partyMember.name || "勇者の仲間"}
									width={40}
									height={40}
									className={`${styles["acquired-party-member-icon-image"]} ${
										styles[`acquired-party-member-icon-image-${partyMember.id}`]
									}`}
								/>
							</div>
						) : (
							<div className={styles["unacquired-party-member-icon"]}>
								<Party.PartyQuestionIcon
									width={40}
									height={40}
									className={styles["unacquired-party-member-icon-image"]}
								/>
							</div>
						)}
						<h2 className={styles["party-member-name"]}>
							{isGuestUser || !partyMember.acquired ? "???" : partyMember.name}
						</h2>
					</Link>
				</div>
			))}
		</div>
	);
};

export default PartyMemberCardList;
