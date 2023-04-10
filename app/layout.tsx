import "@/theme/theme.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import AuthProvider from "@/context/authContext";
import UserProvider from "@/context/userContext";
import Script from "next/script";
import Analytics from "@/components/Analytics/Analytics";

export const metadata = {
  title: {
    default: "Meeple Party",
    template: "%s 🎲 Meeple Party",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Script src="/bootstrap.bundle.min.js" />
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
