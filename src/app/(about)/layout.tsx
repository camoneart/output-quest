import styles from "./AboutLayout.module.css";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles["container"]}`}>
      <main className={`${styles["main"]}`}>
        <div className={`${styles["content"]}`}>{children}</div>
      </main>
    </div>
  );
}
