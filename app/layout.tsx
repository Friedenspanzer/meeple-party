import Analytics from "@/app/_components/Analytics/Analytics";
import Footer from "@/app/_components/Footer/Footer";
import AuthProvider from "@/feature/authentication/context/authContext";
import UserProvider from "@/feature/authentication/context/userContext";
import "@/theme/theme.scss";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { dir } from "i18next";
import Script from "next/script";

import { theme } from "@/theme/mantine";
import { Notifications } from "@mantine/notifications";
import styles from "./page.module.css";

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
    <html lang="de" dir={dir("de")}>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
      <body>
        <MantineProvider forceColorScheme="light" theme={theme}>
          <Script src="/bootstrap.bundle.min.js" />
          <Notifications />
          <AuthProvider>
            <UserProvider>
              <div className={styles.container}>{children}</div>
              <Analytics />
            </UserProvider>
          </AuthProvider>
          <Footer />
        </MantineProvider>
      </body>
      <Script src="/bootstrap.bundle.min.js" />
    </html>
  );
}
