import { Game } from "@/datatypes/client/game";
import { getGame } from "@/lib/data/getGame";
import { Game as ServerGame } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Result } from "./types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

export default function useGame(gameId: number): Result<Game> {
  const queryKey = useGameQueryKey();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: queryKey(gameId),
    queryFn: async () => convertServerResult(await getGame(gameId)),
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
      .then(convertServerResult)
      .then((game) => {
        queryClient.setQueryData(getKey(gameId), game);
        return game;
      });
  };
}

export function useGameQueryKey(): (gameId: number) => any[] {
  return (gameId) => ["game", gameId];
}

function convertServerResult(result: ServerGame): Game {
  return {
    id: result.id,
    maxPlayers: result.maxPlayers,
    minPlayers: result.minPlayers,
    name: result.name,
    playingTime: result.playingTime,
    weight: result.weight,
    year: result.year,
    BGGRank: result.BGGRank || undefined,
    BGGRating: result.BGGRating || undefined,
    image: result.image || undefined,
    thumbnail: result.thumbnail || undefined,
  };
}
