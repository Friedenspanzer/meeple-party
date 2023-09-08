"use client";

import { useUser } from "@/context/userContext";
import {
  defaultUserPreferences,
  UserPreferences,
} from "@/datatypes/userProfile";
import { getUserPreferences } from "@/utility/userProfile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useMemo } from "react";

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
