"use client";

import { useUser } from "@/context/userContext";
import { UserPreferences } from "@/datatypes/userProfile";
import { getUserPreferences } from "@/utility/userProfile";

type UseUserPreferencesResult =
  | {
      preferences: UserPreferences;
      loading: false;
    }
  | {
      preferences: undefined;
      loading: true;
    };

export function useUserPreferences(): UseUserPreferencesResult {
  const { user, loading } = useUser();

  if (loading) {
    return {
      preferences: undefined,
      loading,
    };
  } else {
    if (!user) {
      throw new Error(
        "Could not load user preferences. Did you forget wrapping your components in a UserProvider?"
      );
    } else {
      return {
        preferences: getUserPreferences(user),
        loading: false,
      };
    }
  }
}
