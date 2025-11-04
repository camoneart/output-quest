"use client";

import styles from "./Gnav.module.css";
import * as GnavComponents from "@/features/gnav/components/index";

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
	return (
		<>
			<aside
				className={`${styles["gnav-sidebar"]} ${
					isMenuOpen ? styles["open"] : ""
				} ${className}`}
			>
				<h2 className={`${styles["gnav-sidebar-title"]}`}>メニュー</h2>
				<div className={`${styles["gnav-sidebar-container"]}`}>
					<nav className={`${styles["gnav-sidebar-nav"]}`}>
						<ul className={`${styles["gnav-sidebar-list"]}`}>
							<GnavComponents.GnavItems />
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

export default Gnav;
