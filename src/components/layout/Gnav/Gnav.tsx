"use client";

import styles from "./Gnav.module.css";
import * as GnavComponents from "@/features/Gnav/components/index";

interface GnavProps {
	isMenuOpen?: boolean;
	toggleMenu?: () => void;
	className?: string;
	isLoading?: boolean;
}

const Gnav = ({
	isMenuOpen = false,
	toggleMenu,
	className = "",
	isLoading = false,
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
							{isLoading ? (
								<li className="text-center">読み込み中...</li>
							) : (
								<GnavComponents.GnavItems />
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

export default Gnav;
