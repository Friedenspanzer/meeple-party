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
    <div className="container text-center">
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <Image
            src="/logo.svg"
            width={300}
            height={300}
            alt="Meeple Party"
            className={styles.image}
          />
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-sm-6">
          Meeple Party is currently in closed Alpha. If you received an invite
          go on and register an account and then ask the administrator to unlock
          your account.
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {status === "authenticated" && !!session.user && (
            <>
              <strong>Logged in as {session.user.name}</strong>
              <br />
              <Link href="/app">Go to app</Link>
              <br />
              <br />
              <a href="/api/auth/signout">Logout</a>
            </>
          )}
          {status === "unauthenticated" && (
            <a href="/api/auth/signin">Login/Register</a>
          )}
          {status === "loading" && <Spinner />}
        </div>
      </div>
    </div>
  );
}
