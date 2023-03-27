/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "@/components/Spinner/Spinner";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <>
      <div className={styles.frontpageContainer}>
        <Image
          src="/logo.svg"
          width={500}
          height={500}
          alt="Meeple Party"
        />
        <p>
          Meeple Party is currently in closed Alpha. If you received an invite
          go on and register an account and then ask the administrator to unlock
          your account.
        </p>
        {status === "authenticated" && !!session.user && (
          <>
            <strong>Logged in as {session.user.name}</strong>
            <Link href="/app">Go to app</Link>
            <br />
            <a href="/api/auth/signout">Logout</a>
          </>
        )}
        {status === "unauthenticated" && (
          <a href="/api/auth/signin">Login/Register</a>
        )}
        {status === "loading" && <Spinner />}
      </div>
    </>
  );
}
