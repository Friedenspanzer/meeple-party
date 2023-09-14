"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";
import { useTranslation } from "@/i18n/client";

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
        <p>
          {t("Privacy.ShowRealName.Description")}
        </p>
      </AutoUpdateToggle>
    );
  }
}
