import { GameCollection } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MutableResult } from "./types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

type CollectionStatusUpdate = Partial<
  Omit<GameCollection, "userId" | "gameId" | "updatedAt">
>;

function getCollectionStatus(gameId: number) {
  console.log("Loading game collection", gameId);
  return axios
    .get<GameCollection>(`/api/v2/game/${gameId}/collection`)
    .then((response) => response.data);
}

export default function useCollectionStatus(
  gameId: number
): MutableResult<GameCollection> {
  const queryClient = useQueryClient();
  const {
    isLoading: queryLoading,
    isError: queryError,
    data: queryData,
  } = useQuery({
    queryKey: getCollectionStatusQueryKey(gameId),
    queryFn: () => getCollectionStatus(gameId),
    refetchOnWindowFocus: false,
    staleTime: twoWeeksInMilliSeconds,
  });

  const {
    isLoading: mutationLoading,
    isError: mutationError,
    mutate: mutationFunction,
  } = useMutation({
    mutationKey: getCollectionStatusQueryKey(gameId),
    mutationFn: (data: CollectionStatusUpdate) => {
      return axios
        .patch<CollectionStatusUpdate>(
          `/api/v2/game/${gameId}/collection`,
          data
        )
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(getCollectionStatusQueryKey(gameId), {
        ...queryData,
        ...data,
      });
    },
  });

  return {
    isLoading: queryLoading || mutationLoading,
    isError: queryError || mutationError,
    data: queryData,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: getCollectionStatusQueryKey(gameId),
      });
    },
    mutate: (data, configuration) => mutationFunction(data),
  };
}

export function getCollectionStatusQueryKey(gameId: number): any[] {
  return ["collectionstatus", gameId];
}
