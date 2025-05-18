import * as Home from "@/features/home/components/index";
import styles from "./Home.module.css";

export default function HomePage() {
  return (
    <main className={`${styles["main"]}`}>
      <div className={`${styles["main-container"]}`}>
        <Home.HomeAnimatedTitle />
        <Home.HomeAnimatedSubTitle />
        <Home.HomeAnimatedCharacter />
        <Home.HomeStartButton />
      </div>
    </main>
  );
}
