/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <p>Public Meeple Party Front Page</p>
      {!!session?.user && (
        <p>
          {session.user.name} <a href="/api/auth/signout">Logout</a>{" "}
          <Link href="/app">Go to app</Link>
        </p>
      )}
      {!session?.user && (
        <p>
          <a href="/api/auth/signin">Login</a>
        </p>
      )}
    </>
  );
}
