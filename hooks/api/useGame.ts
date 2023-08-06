import { GameGetResult } from "@/app/api/v2/game/[gameId]/route";
import { Game } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Result } from "./types";

export default function useGame(gameId: number): Result<Game> {
  const queryKey = ["game", gameId];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<GameGetResult>(`/api/v2/game/${gameId}`)
        .then((response) => {
          console.log(response);
          return response.data.game;
        });
    },
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
