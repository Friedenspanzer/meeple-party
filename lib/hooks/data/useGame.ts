import { getGame } from "@/lib/data/getGame";
import { Game, convertGame } from "@/lib/datatypes/client/game";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Result } from "../../../hooks/data/types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

export default function useGame(gameId: number): Result<Game> {
  const queryKey = useGameQueryKey();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: queryKey(gameId),
    queryFn: async () => convertGame(await getGame(gameId)),
    refetchOnWindowFocus: false,
    staleTime: twoWeeksInMilliSeconds,
  });

  return {
    isLoading,
    isError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(gameId) });
    },
  };
}

export function useGameQuery(): (gameId: number) => Promise<Game> {
  const queryClient = useQueryClient();
  const getKey = useGameQueryKey();
  return (gameId) => {
    const cached = queryClient.getQueryData<Game>(getKey(gameId));
    if (cached) {
      return Promise.resolve(cached);
    }
    return getGame(gameId)
      .then(convertGame)
      .then((game) => {
        queryClient.setQueryData(getKey(gameId), game);
        return game;
      });
  };
}

export function useGameQueryKey(): (gameId: number) => any[] {
  return (gameId) => ["game", gameId];
}
