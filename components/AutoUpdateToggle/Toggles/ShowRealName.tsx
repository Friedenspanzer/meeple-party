"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import AutoUpdateToggle from "../AutoUpdateToggle";

export default function ShowRealName() {
  const { preferences, loading } = useUserPreferences();
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <AutoUpdateToggle
        value={preferences.showRealNameInProfile}
        onChange={(value) => ({ ...preferences, showRealNameInProfile: value })}
        title="Public real name"
      >
        <p>
          When this flag is set your real name is visible to everybody. When this flag is not set your real name is only visible to your friends. If you don&apos;t want that either just don&apos;t set a real name and ignore this flag.
        </p>
      </AutoUpdateToggle>
    );
  }
}
