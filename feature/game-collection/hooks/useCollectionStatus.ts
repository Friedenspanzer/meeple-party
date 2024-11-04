import { showError } from "@/lib/utility/error";
import { GameCollection } from "@prisma/client";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { Result } from "../../../lib/types/apiHooks";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

type CollectionStatusUpdate = Partial<
  Pick<GameCollection, "own" | "wantToPlay" | "wishlist">
>;

function getCollectionStatus(gameId: number) {
  console.log("Loading game collection", gameId);
  return axios
    .get<GameCollection>(`/api/v2/game/${gameId}/collection`)
    .then((response) => response.data);
}

interface UseCollectionStatus extends Result<GameCollection> {
  updateMutation: UseMutationResult<CollectionStatusUpdate, Error, any, any>;
}

export default function useCollectionStatus(
  gameId: number
): UseCollectionStatus {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: getCollectionStatusQueryKey(gameId),
    queryFn: () => getCollectionStatus(gameId),
    refetchOnWindowFocus: false,
    staleTime: twoWeeksInMilliSeconds,
  });

  const updateMutation = useMutation({
    mutationKey: getCollectionStatusQueryKey(gameId),
    mutationFn: (data: CollectionStatusUpdate) => {
      return axios
        .patch<CollectionStatusUpdate>(
          `/api/v2/game/${gameId}/collection`,
          data
        )
        .then((response) => response.data);
    },
    onMutate: async (newData) => {
      const queryKey = getCollectionStatusQueryKey(gameId);
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldData: GameCollection) => ({
        ...oldData,
        ...newData,
      }));
      return { previousData };
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(getCollectionStatusQueryKey(gameId), {
        ...data,
        ...newData,
      });
    },
    onError: (error: Error, newData, context) => {
      console.error(error);
      showError({ message: "Could not update collection status." });
      queryClient.setQueryData(
        getCollectionStatusQueryKey(gameId),
        context?.previousData
      );
    },
  });

  return {
    isLoading,
    isError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: getCollectionStatusQueryKey(gameId),
      });
    },
    updateMutation,
  };
}

export function getCollectionStatusQueryKey(gameId: number): any[] {
  return ["collectionstatus", gameId];
}
