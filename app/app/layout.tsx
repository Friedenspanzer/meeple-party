/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Avatar from "@/components/Avatar/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./app.module.css";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useUser } from "@/context/userContext";
import CompleteUserProfile from "@/components/CompleteUserProfile/CompleteUserProfile";

TimeAgo.addDefaultLocale(en);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();

  if (!!loading) {
    return (
      <div className={styles.spinner}>
        <div className="spinner-border" />
      </div>
    );
  } else if (!user) {
    return (
      <>
        <h2>Not logged in</h2>
        <p>
          You are not logged in to Meeple Party. This <em>should</em> fix itself
          but apparently that didn&apos;t work. There&apos;s probably something
          wrong with the intertubes. Please go back to the{" "}
          <Link href="/">front page of Meeple Party and try again.</Link>
        </p>
      </>
    );
  } else {
    return (
      <>
        <nav className={styles.menuBar}>
          <div className={styles.logo}>Meeple Party!</div>
          <ul className={styles.menu} style={{ marginBottom: 0 }}>
            <Link href="/app">
              <li className={pathname === "/app" ? styles.active : ""}>
                Dashboard
              </li>
            </Link>
            <Link href="/app/collection">
              <li
                className={
                  pathname?.startsWith("/app/collection") ? styles.active : ""
                }
              >
                Your Collection
              </li>
            </Link>
            <Link href="/app/friends">
              <li
                className={
                  pathname?.startsWith("/app/friends") ? styles.active : ""
                }
              >
                Friends
              </li>
            </Link>
          </ul>
          <div className={styles.user}>
            <div className={styles.avatar}>
              <Avatar image={user.image} name={!!user.name ? user.name : ""} />
            </div>
            <div className={styles.username}>{user.name}</div>
            <div className={styles.realname}>{user.realName}</div>
            <div className={styles.usermenu}>
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/api/auth/signout" className="dropdown-item">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        {!user.profileComplete ? <CompleteUserProfile /> :
        <div className={styles.content}>
          {children}
          <div className="clearfix"></div>
        </div> }
      </>
    );
  }
}
