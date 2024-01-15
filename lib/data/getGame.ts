import { GameGetResult } from "@/app/api/v2/game/[gameId]/route";
import { Game } from "@prisma/client";
import axios from "axios";

export function getGame(gameId: number): Promise<Game> {
  return axios
    .get<GameGetResult>(`/api/v2/game/${gameId}`)
    .then((response) => response.data.game);
}
