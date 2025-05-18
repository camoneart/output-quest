import styles from "./ConnectionLayout.module.css";

export default function ConnectionLayout({
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
