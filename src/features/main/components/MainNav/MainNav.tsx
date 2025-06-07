"use client";

import styles from "./MainNav.module.css";
import * as Main from "@/features/main/components/index";

interface MainNavProps {
	isMenuOpen?: boolean;
	toggleMenu?: () => void;
	className?: string;
}

const MainNav = ({
	isMenuOpen = false,
	toggleMenu,
	className = "",
}: MainNavProps) => {
	return (
		<>
			<aside
				className={`${styles["main-sidebar"]} ${
					isMenuOpen ? styles["open"] : ""
				} ${className}`}
			>
				<h2 className={`${styles["main-sidebar-title"]}`}>メニュー</h2>
				<div className={`${styles["main-sidebar-container"]}`}>
					<nav className={`${styles["main-sidebar-nav"]}`}>
						<ul className={`${styles["main-sidebar-list"]}`}>
							<Main.MainNavItems />
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

export default MainNav;
