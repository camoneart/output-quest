"use client";

import React from "react";
import Link from "next/link";
import styles from "../party-member-card-list/PartyMemberCardList.module.css";
import Image from "next/image";
import * as Party from "@/features/party/components/index";
import { useRouter } from "next/navigation";
import { useClickSound } from "@/components/common/audio/click-sound/ClickSound";
import { PartyMember } from "@/features/party/types/party.types";

interface PartyMemberCardListClientProps {
	members: PartyMember[];
	isGuestUser: boolean;
}

const PartyMemberCardListClient: React.FC<PartyMemberCardListClientProps> = ({
	members,
	isGuestUser,
}) => {
	const router = useRouter();
	const { playClickSound } = useClickSound({
		soundPath: "/audio/click-sound_decision.mp3",
		volume: 0.5,
		delay: 190,
	});

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		e.preventDefault();
		playClickSound(() => router.push(path));
	};

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

export default PartyMemberCardListClient;
