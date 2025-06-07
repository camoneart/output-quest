"use client";

import styles from "./PublicNav.module.css";
import * as Public from "@/features/public/components/index";

interface PublicNavProps {
	isMenuOpen?: boolean;
	toggleMenu?: () => void;
	className?: string;
	isLoading?: boolean;
}

const PublicNav = ({
	isMenuOpen = false,
	toggleMenu,
	className = "",
	isLoading = false,
}: PublicNavProps) => {
	return (
		<>
			<aside
				className={`${styles["public-sidebar"]} ${
					isMenuOpen ? styles["open"] : ""
				} ${className}`}
			>
				<h2 className={`${styles["public-sidebar-title"]}`}>メニュー</h2>
				<div className={`${styles["public-sidebar-container"]}`}>
					<nav className={`${styles["public-sidebar-nav"]}`}>
						<ul className={`${styles["public-sidebar-list"]}`}>
							{isLoading ? (
								<li className="text-center">読み込み中...</li>
							) : (
								<Public.PublicNavItems />
							)}
						</ul>
					</nav>
				</div>
			</aside>
			{isMenuOpen && toggleMenu && (
				<div className={styles["overlay"]} onClick={toggleMenu}></div>
			)}
		</>
	);
};

export default PublicNav;
