/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import Spinner from "../../components/Spinner/Spinner";

const LoginButtons: React.FC<{}> = () => {
  const { user, loading } = useUser();
  if (!loading && user) {
    return (
      <>
        <strong>Logged in as {user.name}</strong>
        <br />
        <Link href="/app">Go to app</Link>
        <br />
        <br />
        <a href="/api/auth/signout">Logout</a>
      </>
    );
  } else if (!loading && !user) {
    return <a href="/api/auth/signin">Login/Register</a>;
  }

  return <Spinner />;
};

export default LoginButtons;
