"use client";

import { useTranslation } from "@/i18n/client";
import Spinner from "@/lib/components/Spinner/Spinner";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import AutoUpdateToggle from "../../../../../../../lib/components/AutoUpdateToggle/AutoUpdateToggle";

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
