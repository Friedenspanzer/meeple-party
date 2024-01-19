import { GameGetResult } from "@/app/api/v2/game/[gameId]/route";
import { Game as ServerGame } from "@prisma/client";
import axios from "axios";
import { Game } from "../datatypes/client/game";

export function getGame(gameId: number): Promise<Game> {
  return axios
    .get<GameGetResult>(`/api/v2/game/${gameId}`)
    .then((response) => response.data.game)
    .then(convertGame);
}

export function convertGame(serverGame: ServerGame): Game {
  return {
    id: serverGame.id,
    maxPlayers: serverGame.maxPlayers,
    minPlayers: serverGame.minPlayers,
    name: serverGame.name,
    playingTime: serverGame.playingTime,
    weight: serverGame.weight,
    year: serverGame.year,
    BGGRank: serverGame.BGGRank || undefined,
    BGGRating: serverGame.BGGRating || undefined,
    image: serverGame.image || undefined,
    thumbnail: serverGame.thumbnail || undefined,
  };
}
