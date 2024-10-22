"use client";

import { useTranslation } from "@/i18n/client";
import AutoUpdateToggle from "@/lib/components/AutoUpdateToggle/AutoUpdateToggle";
import Spinner from "@/lib/components/Spinner/Spinner";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";

export default function ShowRealName() {
  const { t } = useTranslation("settings");
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.showRealNameInProfile}
        onChange={(value) => ({ ...preferences, showRealNameInProfile: value })}
        title={t("Privacy.ShowRealName.Title")}
      >
        <p>{t("Privacy.ShowRealName.Description")}</p>
      </AutoUpdateToggle>
    );
  }
}
