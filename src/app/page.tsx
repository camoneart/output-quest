import dynamic from "next/dynamic";
import styles from "./Home.module.css";
import * as Home from "@/features/home/components/index";

// Motion使用コンポーネントを動的インポート（Client Bundleを最小化）
const HomeAnimatedTitle = dynamic(
  () => import("@/features/home/components/home-animated-title/HomeAnimatedTitle")
);

const HomeAnimatedCharacter = dynamic(
  () => import("@/features/home/components/home-animated-character/HomeAnimatedCharacter")
);

export default function HomePage() {
  return (
    <main className={`${styles["main"]}`}>
      <div className={`${styles["main-container"]}`}>
        <HomeAnimatedTitle />
        <Home.HomeAnimatedSubTitle />
        <HomeAnimatedCharacter />
        <Home.HomeStartButton />
      </div>
    </main>
  );
}
