"use client";

import { useTranslation } from "@/i18n/client";
import Spinner from "@/lib/components/Spinner/Spinner";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import AutoUpdateToggle from "../../../../../../lib/components/AutoUpdateToggle/AutoUpdateToggle";

export default function PlaceSearchable() {
  const { t } = useTranslation("settings");
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.allowSearchByPlace}
        onChange={(value) => ({ ...preferences, allowSearchByPlace: value })}
        title={t("Privacy.SearchByPlace.Title")}
      >
        <p>{t("Privacy.SearchByPlace.Description")}</p>
      </AutoUpdateToggle>
    );
  }
}
