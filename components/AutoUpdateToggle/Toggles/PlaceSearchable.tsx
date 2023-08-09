"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";

export default function PlaceSearchable() {
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.allowSearchByPlace}
        onChange={(value) => ({ ...preferences, allowSearchByPlace: value })}
        title="Allow search by place"
      >
        <p>
          When this flag is set people can find you by searching for your place.
        </p>
      </AutoUpdateToggle>
    );
  }
}
