"use client";

import React from "react";
import * as Main from "@/features/main/components/index";
import * as Public from "@/features/public/components/index";
import { useUser } from "@clerk/nextjs";
import { useHero } from "@/contexts/HeroContext";

interface GnavProps {
	isMenuOpen?: boolean;
	toggleMenu?: () => void;
	className?: string;
}

const Gnav = ({
	isMenuOpen = false,
	toggleMenu,
	className = "",
}: GnavProps) => {
	const { isLoaded: isClerkLoaded, isSignedIn } = useUser();
	const { hero, isLoading: isHeroLoading } = useHero();

	const isLoading = !isClerkLoaded || isHeroLoading;

	const isZennConnected =
		!isLoading && isSignedIn && hero && !!hero.zennUsername;

	return (
		<>
			{isZennConnected ? (
				<Main.MainNav
					isMenuOpen={isMenuOpen}
					toggleMenu={toggleMenu}
					className={className}
					isLoading={isLoading}
				/>
			) : (
				<Public.PublicNav
					isMenuOpen={isMenuOpen}
					toggleMenu={toggleMenu}
					className={className}
					isLoading={isLoading}
				/>
			)}
		</>
	);
};

export default Gnav;
