"use client";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useUser } from "@/context/userContext";
import Link from "next/link";
import CompleteUserProfile from "../CompleteUserProfile/CompleteUserProfile";
import TopNav from "../TopNav/TopNav";
import styles from "./appcontainer.module.css";

TimeAgo.addDefaultLocale(en);

export interface AppContainerProps {
  children?: React.ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
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
        <TopNav />
        {!user.profileComplete ? (
          <CompleteUserProfile />
        ) : (
          <div className={styles.content}>
            {children}
            <div className="clearfix"></div>
          </div>
        )}
      </>
    );
  }
};

export default AppContainer;
