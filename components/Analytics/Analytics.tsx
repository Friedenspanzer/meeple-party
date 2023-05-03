"use client";

import { useUser } from "@/context/userContext";
import { getUserPreferences } from "@/utility/userProfile";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useCallback } from "react";

export default function Analytics() {
  const { user, loading } = useUser();

  const beforeSend = useCallback(
    (event: any) => {
      if (loading || !user || !getUserPreferences(user).sendAnalyticsData) {
        return null;
      }
      return event;
    },
    [user, loading]
  );

  return <VercelAnalytics beforeSend={beforeSend} />;
}
