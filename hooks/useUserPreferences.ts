"use client";

import { useUser } from "@/context/userContext";
import {
  defaultUserPreferences,
  UserPreferences,
} from "@/datatypes/userProfile";
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
      return {
        preferences: defaultUserPreferences,
        loading: false,
      };
    } else {
      return {
        preferences: getUserPreferences(user),
        loading: false,
      };
    }
  }
}
