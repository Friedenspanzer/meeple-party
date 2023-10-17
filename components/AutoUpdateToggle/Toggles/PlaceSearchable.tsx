"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";
import { useTranslation } from "@/i18n/client";

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
        <p>
          {t("Privacy.SearchByPlace.Description")}
        </p>
      </AutoUpdateToggle>
    );
  }
}
