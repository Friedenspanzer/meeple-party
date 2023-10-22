import { GameCollection } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MutableResult } from "./types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

type GameCollectionUpdate = Partial<
  Omit<GameCollection, "userId" | "gameId" | "updatedAt">
>;

function getGameCollection(gameId: number) {
  console.log("Loading game collection", gameId);
  return axios
    .get<GameCollection>(`/api/v2/game/${gameId}/collection`)
    .then((response) => response.data);
}

export default function useGameCollection(
  gameId: number
): MutableResult<GameCollection> {
  const queryKey = useGameCollectionQueryKey();
  const queryClient = useQueryClient();
  const {
    isLoading: queryLoading,
    isError: queryError,
    data: queryData,
  } = useQuery({
    queryKey: queryKey(gameId),
    queryFn: () => getGameCollection(gameId),
    refetchOnWindowFocus: false,
    staleTime: twoWeeksInMilliSeconds,
  });

  const {
    isLoading: mutationLoading,
    isError: mutationError,
    mutate: mutationFunction,
  } = useMutation({
    mutationKey: queryKey(gameId),
    mutationFn: (data: GameCollectionUpdate) => {
      return axios
        .patch<GameCollectionUpdate>(`/api/v2/game/${gameId}/collection`, data)
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey(gameId), { ...queryData, ...data });
    },
  });

  return {
    isLoading: queryLoading || mutationLoading,
    isError: queryError || mutationError,
    data: queryData,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(gameId) });
    },
    mutate: (data, configuration) => mutationFunction(data),
  };
}

export function useGameCollectionQueryKey(): (gameId: number) => any[] {
  return (gameId) => ["gamecollection", gameId];
}
