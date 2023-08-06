import { GameGetResult } from "@/app/api/v2/game/[gameId]/route";
import { Game } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Result } from "./types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

export default function useGame(gameId: number): Result<Game> {
  const queryKey = ["game", gameId];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<GameGetResult>(`/api/v2/game/${gameId}`)
        .then((response) => response.data.game);
    },
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
