import styles from "./LegalLayout.module.css";

export default function LegalLayout({
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
