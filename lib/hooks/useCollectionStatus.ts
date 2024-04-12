import { GameCollection } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MutableResult } from "../../hooks/api/types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

export type CollectionStatus = Omit<
  GameCollection,
  "userId" | "gameId" | "updatedAt"
>;
export type CollectionStatusUpdate = Partial<CollectionStatus>;

function getCollectionStatus(gameId: number): Promise<CollectionStatus> {
  return axios
    .get<GameCollection>(`/api/v2/game/${gameId}/collection`)
    .then((response) => response.data);
}

export default function useCollectionStatus(
  gameId: number
): MutableResult<CollectionStatus> {
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
    isPending: mutationLoading,
    isError: mutationError,
    mutate: mutationFunction,
  } = useMutation({
    mutationKey: getCollectionStatusQueryKey(gameId),
    mutationFn: (data: CollectionStatusUpdate) => {
      return axios
        .patch<GameCollection>(`/api/v2/game/${gameId}/collection`, data)
        .then((response) => response.data);
    },
    onMutate: async (data) => {
      const previousData = queryClient.getQueryData<CollectionStatus>(
        getCollectionStatusQueryKey(gameId)
      );

      const newData: CollectionStatus = {
        own: combine(previousData?.own, data.own),
        wantToPlay: combine(previousData?.wantToPlay, data.wantToPlay),
        wishlist: combine(previousData?.wishlist, data.wishlist),
      };

      queryClient.setQueryData<CollectionStatus>(
        getCollectionStatusQueryKey(gameId),
        newData
      );

      console.log("onMutate", data, newData);

      return { previousData };
    },
    onError: async (error, data, context) => {
      //TODO Error handling
      if (context?.previousData) {
        queryClient.setQueryData(
          getCollectionStatusQueryKey(gameId),
          context.previousData
        );
      }
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(getCollectionStatusQueryKey(gameId), data);
    },
  });

  return {
    isLoading: queryLoading || mutationLoading,
    isError: queryError,
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

function combine(
  oldData: boolean | undefined,
  newData: boolean | undefined
): boolean {
  if (newData !== undefined) {
    return newData;
  } else if (oldData !== undefined) {
    return oldData;
  } else {
    return false;
  }
}
