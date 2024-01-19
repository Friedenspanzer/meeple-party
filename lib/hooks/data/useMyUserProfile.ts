import { getMyUserProfile } from "@/lib/dataAccess/userProfile";
import { MyUserProfile } from "@/lib/datatypes/client/userProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

interface Result {
  isLoading: boolean;
  isError: boolean;
  userProfile: MyUserProfile | undefined;
  invalidate: () => void;
  update: (user: Partial<MyUserProfile>) => Promise<MyUserProfile>;
}

export const MY_USER_PROFILE_QUERY_KEY = ["user"];

export default function useMyUserProfile(): Result {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: MY_USER_PROFILE_QUERY_KEY,
    queryFn: getMyUserProfile,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  });

  const update = useCallback(
    (user: Partial<MyUserProfile>) => {
      const newData = { ...data, ...user } as MyUserProfile;
      return axios
        .patch("/api/user", {
          ...newData,
          favorites: user.favorites
            ? user.favorites.map((f) => f.id)
            : data?.favorites.map((f) => f.id),
        })
        .then(() => {
          queryClient.setQueryData(["user"], () => newData);
          return newData;
        });
    },
    [data, queryClient]
  );

  return {
    isLoading,
    isError,
    userProfile: data,
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: MY_USER_PROFILE_QUERY_KEY }),
    update,
  };
}
