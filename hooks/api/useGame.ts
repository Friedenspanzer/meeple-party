import { GameGetResult } from "@/app/api/v2/game/[gameId]/route";
import { Game } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Result } from "./types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

function getGame(gameId: number) {
  return axios
    .get<GameGetResult>(`/api/v2/game/${gameId}`)
    .then((response) => response.data.game);
}

export default function useGame(gameId: number): Result<Game> {
  const { getKey } = useGameQueryKey();
  const queryKey = getKey(gameId);
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => getGame(gameId),
    refetchOnWindowFocus: false,
    staleTime: twoWeeksInMilliSeconds,
  });

  return {
    isLoading,
    isError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

interface GameQuery {
  get: (gameId: number) => Promise<Game>;
}

export function useGameQuery(): GameQuery {
  const queryClient = useQueryClient();
  const { getKey } = useGameQueryKey();
  return {
    get: (gameId) => {
      return getGame(gameId).then((game) => {
        queryClient.setQueryData(getKey(gameId), game);
        return game;
      });
    },
  };
}

interface GameQueryKey {
  getKey: (gameId: number) => any[];
}

export function useGameQueryKey(): GameQueryKey {
  return {
    getKey: (gameId) => ["game", gameId],
  };
}
