import "./globals.css";
import "@/theme/theme.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";

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
