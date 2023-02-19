"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./app.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  if (!!isLoading) {
    return <div className={styles.spinner}><ProgressSpinner /></div>;
  } else if (!user || !!error) {
    return (
      <Dialog
        header="Not logged in"
        visible={true}
        onHide={() => router.replace("/")}
        style={{ maxWidth: "50vw" }}
      >
        <p>
          You are not logged in to Meeple Party. This <em>should</em> fix itself
          but apparently that didn&apos;t work. There&apos;s probably something wrong with
          the intertubes. Please go back to the{" "}
          <Link href="/">front page of Meeple Party and try again.</Link>
        </p>
      </Dialog>
    );
  } else {
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
              <li
                className={pathname === "/app/collection" ? styles.active : ""}
              >
                Collection
              </li>
            </Link>
            <Link href="/app/friends">
              <li className={pathname === "/app/friends" ? styles.active : ""}>
                Friends
              </li>
            </Link>
          </ul>
          <div className={styles.user}>User: {user.name} <Link href="/api/auth/logout" prefetch={false}>Logut</Link></div>
        </nav>

        {children}
      </>
    );
  }
}
