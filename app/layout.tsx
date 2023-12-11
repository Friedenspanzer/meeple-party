import Analytics from "@/components/Analytics/Analytics";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/context/authContext";
import UserProvider from "@/context/userContext";
import "@/theme/theme.scss";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { dir } from "i18next";
import Script from "next/script";

import { theme } from "@/theme/mantine";
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
        <Script src="/bootstrap.bundle.min.js" />
        <AuthProvider>
          <UserProvider>
            <MantineProvider forceColorScheme="light" theme={theme}>
              <div className={styles.container}>{children}</div>
            </MantineProvider>
            <Analytics />
          </UserProvider>
        </AuthProvider>
        <Footer />
      </body>
      <Script src="/bootstrap.bundle.min.js" />
    </html>
  );
}
