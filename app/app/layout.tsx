/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { UserProfile } from ".prisma/client";
import Avatar from "@/components/Avatar/Avatar";
import CompleteUserProfile from "@/components/CompleteUserProfile/CompleteUserProfile";
import { UserContext } from "@/context/userContext";
import { UserProfile as Auth0User, useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./app.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, error, isLoading } = useUser();
  const [userProfile, setUserProfile] = useState<
    UserProfile | null | undefined
  >(undefined);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!!user) {
      fetch("/api/database/activeUserProfile")
        .then((value) => value.json())
        .then((value) => {
          setUserProfile(value);
          return value;
        })
        .then((value) => setUserProfile(tryPrefillFields(value, user)))
        .then(() => setLoadingProfile(false));
    }
  }, [user]);

  if (!!isLoading || !!loadingProfile) {
    return (
      <div className={styles.spinner}>
        <div className="spinner-border" />
      </div>
    );
  } else if (!user || !!error || !userProfile) {
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
              <Avatar image={userProfile.picture} name={userProfile.name} />
            </div>
            <div className={styles.username}>{userProfile.name}</div>
            <div className={styles.realname}>{userProfile.realName}</div>
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
                    <a href="/api/auth/logout" className="dropdown-item">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <div className={styles.content}>
          {isCompleteUserProfile(userProfile) ? (
            <UserContext.Provider value={userProfile}>
              {children}
            </UserContext.Provider>
          ) : (
            <CompleteUserProfile
              userProfile={userProfile as UserProfile}
              onUserProfileComplete={setUserProfile}
            />
          )}
          <div className="clearfix"></div>
        </div>
      </>
    );
  }
}

function isCompleteUserProfile(profile: UserProfile | undefined | null) {
  return !!profile && profile.id > 0 && !!profile.email && !!profile.name;
}

function tryPrefillFields(
  profile: UserProfile | undefined | null,
  user: Auth0User
): UserProfile {
  return {
    id: profile?.id || -1,
    email: profile?.email || user.email || "",
    name: profile?.name || user.nickname || "",
    picture: profile?.picture || null,
    realName: profile?.realName || user.name || null,
    bggName: profile?.bggName || null,
  };
}
