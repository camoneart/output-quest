import styles from "./HamburgerMenu.module.css";

interface HamburgerMenuProps {
  toggleMenu: () => void;
  isOpen: boolean;
}

const HamburgerMenu = ({ toggleMenu, isOpen }: HamburgerMenuProps) => {
  return (
    <button
      className={`${styles["hamburger"]} ${isOpen ? styles["open"] : ""}`}
      onClick={toggleMenu}
      aria-label="メニューを開く"
      aria-expanded={isOpen}
    >
      <span className={styles["hamburger-line"]}></span>
      <span className={styles["hamburger-line"]}></span>
      <span className={styles["hamburger-line"]}></span>
    </button>
  );
};

export default HamburgerMenu;
