import { Game as ServerGame } from "@prisma/client";
export interface Game {
  id: number;
  name: string;
  thumbnail?: string;
  image?: string;
  year: number;
  playingTime: number;
  minPlayers: number;
  maxPlayers: number;
  weight: number;
  BGGRating?: number;
  BGGRank?: number;
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
