"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";

export default function ShowPlaceInProfile() {
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.showPlaceInProfile}
        onChange={(value) => ({ ...preferences, showPlaceInProfile: value })}
        title="Public place"
      >
        <p>
          When this flag is set the place you provided is visibile to everybody.
          When this flag is not set the palce you provided is only visible to
          your friends. If you don&apos;t want that either just don&apos;t set a
          place and ignore this flag.
        </p>
      </AutoUpdateToggle>
    );
  }
}
