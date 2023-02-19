"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./app.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <nav className={styles.menuBar}>
        <div className={styles.logo}>Meeple Party!</div>
        <ul className={styles.menu}>
          <Link href="/app">
            <li className={pathname === "/app" ? styles.active : ""}>
              Dashboard
            </li>
          </Link>
          <Link href="/app/collection">
            <li className={pathname === "/app/collection" ? styles.active : ""}>
              Collection
            </li>
          </Link>
          <Link href="/app/friends">
            <li className={pathname === "/app/friends" ? styles.active : ""}>
              Friends
            </li>
          </Link>
        </ul>
        <div className={styles.user}>User</div>
      </nav>

      {children}
    </>
  );
}
