"use client";

import CompleteUserProfile from "@/feature/profiles/components/CompleteUserProfile/CompleteUserProfile";
import ModalProvider from "@/lib/contexts/modalContext";
import useUserProfile from "@/lib/hooks/useUserProfile";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import classNames from "classnames";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Link from "next/link";
import Spinner from "../../../../lib/components/Spinner/Spinner";
import TopNav from "../TopNav/TopNav";
import styles from "./appcontainer.module.css";

TimeAgo.addDefaultLocale(en);

export interface AppContainerProps {
  children?: React.ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const { isLoading, userProfile } = useUserProfile();

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );
  } else if (!userProfile) {
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
      <ModalProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <TopNav />
        {!userProfile.profileComplete ? (
          <CompleteUserProfile />
        ) : (
          <div className={classNames(styles.content, "container")}>
            {children}
            <div className="clearfix"></div>
          </div>
        )}
      </ModalProvider>
    );
  }
};

export default AppContainer;
