"use client";

import { useTranslation } from "@/i18n/client";
import AutoUpdateToggle from "@/lib/components/AutoUpdateToggle/AutoUpdateToggle";
import Spinner from "@/lib/components/Spinner/Spinner";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";

export default function SendAnalyticsData() {
  const { t } = useTranslation("settings");
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.sendAnalyticsData}
        onChange={(value) => ({ ...preferences, sendAnalyticsData: value })}
        title={t("Privacy.SendAnalyticsData.Title")}
      >
        <p>{t("Privacy.SendAnalyticsData.Description")}</p>
      </AutoUpdateToggle>
    );
  }
}
