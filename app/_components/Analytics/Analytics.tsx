"use client";

import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useCallback } from "react";

export default function Analytics() {
  const { loading, preferences } = useUserPreferences();

  const beforeSend = useCallback(
    (event: any) => {
      if (loading || !preferences || !preferences.sendAnalyticsData) {
        return null;
      }
      return event;
    },
    [preferences, loading]
  );

  return <VercelAnalytics beforeSend={beforeSend} />;
}
