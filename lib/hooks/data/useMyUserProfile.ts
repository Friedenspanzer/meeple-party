import { getMyUserProfile } from "@/lib/data/getUserProfile";
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

export default function useMyUserProfile(): Result {
  const queryKey = ["user"];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: getMyUserProfile,
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
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    update,
  };
}
