"use client";

import { useTranslation } from "@/i18n/client";
import AutoUpdateToggle from "@/lib/components/AutoUpdateToggle/AutoUpdateToggle";
import Spinner from "@/lib/components/Spinner/Spinner";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";

export default function ShowPlaceInProfile() {
  const { t } = useTranslation("settings");
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.showPlaceInProfile}
        onChange={(value) => ({ ...preferences, showPlaceInProfile: value })}
        title={t("Privacy.ShowPlaceInProfile.Title")}
      >
        <p>{t("Privacy.ShowPlaceInProfile.Description")}</p>
      </AutoUpdateToggle>
    );
  }
}
