"use client";

import {
  defaultUserPreferences,
  UserPreferences,
} from "@/datatypes/userProfile";
import { useUser } from "@/feature/authentication/context/userContext";
import { getUserPreferences } from "@/utility/userProfile";
import axios from "axios";
import { useCallback } from "react";

type UseUserPreferencesResult =
  | {
      preferences: UserPreferences;
      loading: false;
      update: (preferences: Partial<UserPreferences>) => Promise<void>;
    }
  | {
      preferences: undefined;
      loading: true;
      update: (preferences: Partial<UserPreferences>) => Promise<void>;
    };

export function useUserPreferences(): UseUserPreferencesResult {
  const { user, loading, update: updateUser } = useUser();

  const update = useCallback(
    (preferences: Partial<UserPreferences>) => {
      if (user) {
        return axios
          .patch("/api/user", {
            preferences: {
              ...getUserPreferences(user),
              ...preferences,
            },
          })
          .then(() => {
            updateUser();
          });
      } else {
        return Promise.reject();
      }
    },
    [updateUser, user]
  );

  if (loading) {
    return {
      preferences: undefined,
      loading,
      update,
    };
  } else {
    if (!user) {
      return {
        preferences: defaultUserPreferences,
        loading: false,
        update,
      };
    } else {
      return {
        preferences: getUserPreferences(user),
        loading: false,
        update,
      };
    }
  }
}
