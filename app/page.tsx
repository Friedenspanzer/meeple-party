/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user } = useUser();
  return (
    <>
      <p>Public Meeple Party Front Page</p>
      {!!user && (
        <p>
          {user?.name} <a href="/api/auth/logout">Logout</a>{" "}
          <Link href="/app">Go to app</Link>
        </p>
      )}
      {!user && (
        <p>
          <a href="/api/auth/login">Login</a>
        </p>
      )}
    </>
  );
}
