"use client";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
require("bootstrap/dist/js/bootstrap")

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <head />
        <body>{children}</body>
      </UserProvider>
    </html>
  );
}
