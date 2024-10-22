"use client";

import { useTranslation } from "@/i18n/client";
import Spinner from "@/lib/components/Spinner/Spinner";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";

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
