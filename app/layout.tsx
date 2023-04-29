import "@/theme/theme.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import AuthProvider from "@/context/authContext";
import UserProvider from "@/context/userContext";
import Script from "next/script";
import Analytics from "@/components/Analytics/Analytics";
import { getServerUser } from "@/utility/serverSession";
import { getUserPreferences } from "@/utility/userProfile";

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
  const user = await getServerUser();
  const sendAnalytics = getUserPreferences(user).sendAnalyticsData;
  return (
    <html lang="en">
      <head />
      <body>
        <Script src="/bootstrap.bundle.min.js" />
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
        {sendAnalytics && <Analytics />}
      </body>
      <Script src="/bootstrap.bundle.min.js" />
    </html>
  );
}
