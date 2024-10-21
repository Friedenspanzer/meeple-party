import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import { Result } from "@/hooks/api/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export function useGameCollection(userId: string): Result<GameCollectionResult> {
  const queryKey = useGameCollectionQueryKey();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: queryKey(userId),
    queryFn: () => {
      return axios
        .get<GameCollectionResult>(`/api/v2/user/${userId}/collection`)
        .then((response) => response.data);
    },
  });
  const value = useMemo<Result<GameCollectionResult>>(() => {
    return {
      data,
      isLoading,
      isError,
      invalidate: () => {
        queryClient.invalidateQueries({ queryKey: queryKey(userId) });
      },
    };
  }, [isLoading, isError, data, queryClient, queryKey, userId]);

  return value;
}

export function useGameCollectionQueryKey(): (userId: string) => any[] {
  return (userId) => ["gamecollection", userId];
}
