"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";

export default function SendAnalyticsData() {
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.sendAnalyticsData}
        onChange={(value) => ({ ...preferences, sendAnalyticsData: value })}
        title="Send analytics data"
      >
        <p>
          Help us improve Meeple Party by allowing us to collect usage data.
          Data is lightweight and fully anonymized. It&apos;s collected by our
          hosting provider Vercel.
        </p>
      </AutoUpdateToggle>
    );
  }
}
