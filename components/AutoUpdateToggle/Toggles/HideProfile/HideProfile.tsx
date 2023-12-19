"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTranslation } from "@/i18n/client";
import AutoUpdateToggle from "../../AutoUpdateToggle";

export default function HideProfile() {
  const { t } = useTranslation("settings");
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.hideProfile}
        onChange={(value) => ({ ...preferences, hideProfile: value })}
        title={t("Privacy.HideProfile.Title")}
      >
        <p>{t("Privacy.HideProfile.Description")}</p>
      </AutoUpdateToggle>
    );
  }
}
