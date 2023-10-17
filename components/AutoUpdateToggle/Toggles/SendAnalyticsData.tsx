"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";
import { useTranslation } from "@/i18n/client";

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
        <p>
          {t("Privacy.SendAnalyticsData.Description")}
        </p>
      </AutoUpdateToggle>
    );
  }
}
