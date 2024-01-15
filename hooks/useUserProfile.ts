import { Game } from "@/datatypes/client/game";
import { User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

type ExtendedUser = Omit<
  User & {
    favorites: Game[];
  },
  "preferences"
>;

interface Result {
  isLoading: boolean;
  isError: boolean;
  userProfile: ExtendedUser | undefined;
  invalidate: () => void;
  update: (user: Partial<ExtendedUser>) => Promise<ExtendedUser>;
}

export default function useUserProfile(): Result {
  const queryKey = ["user"];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<ExtendedUser>("/api/user")
        .then((response) => response.data);
    },
  });

  const update = useCallback(
    (user: Partial<ExtendedUser>) => {
      const newData = { ...data, ...user } as ExtendedUser;
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
