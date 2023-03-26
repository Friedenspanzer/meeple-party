import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.stack}></div>
      <div className={styles.stack}>
        <strong>Meeple Party</strong>
        <small>Pascal Greilach</small>
        <small>2023</small>
      </div>
      <div className={styles.stack}>
        <Link href="https://github.com/Friedenspanzer/meeple-party/issues" target="_blank">
          Issue Tracking
        </Link>
        <Link href="https://github.com/Friedenspanzer/meeple-party/pulls?q=is%3Apr+is%3Aclosed" target="_blank">
          Latest Changes
        </Link>
      </div>
    </div>
  );
}
