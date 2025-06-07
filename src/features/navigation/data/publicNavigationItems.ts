import { NavigationItem } from "../types/navigation.types";

export const publicNavigationItems: NavigationItem[] = [
  {
    id: 1,
    title: "連携",
    href: "/connection",
    icon: "/images/nav-icon/zenn-logo.svg",
    alt: "連携",
    width: 20,
    height: 20,
  },
  {
    id: 2,
    title: "OUTPUT QUESTとは ?",
    href: "/about",
    icon: "/images/nav-icon/hero.svg",
    alt: "OUTPUT QUESTとは ?",
    width: 20,
    height: 20,
  },
  {
    id: 3,
    title: "利用規約",
    href: "/terms",
    icon: "/images/nav-icon/terms-nav-icon.svg",
    alt: "利用規約",
    width: 20,
    height: 20,
  },
  {
    id: 4,
    title: "プライバシーポリシー",
    href: "/privacy",
    icon: "/images/nav-icon/privacy-nav-icon.svg",
    alt: "プライバシーポリシー",
  },
];
