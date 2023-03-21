import "./globals.css";
import "@/theme/theme.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import { headers } from "next/headers";
import { Session } from "next-auth";

import AuthProvider from "@/context/authContext";
import UserProvider from "@/context/userContext";

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch("/api/auth/session", {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession(headers().get("cookie") ?? "");
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
