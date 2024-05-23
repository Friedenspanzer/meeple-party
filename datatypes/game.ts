import * as client from "@prisma/client";

/**
 * General game information known to Meeple Party
 */
export type Game = Omit<client.Game, "updatedAt">;

/**
 * Game information as found on BoardGameGeek
 */
export interface BggGame extends Omit<Game, "wikidataId"> {
  description: string;
  designers: string[];
  artists: string[];
  age: number;
}

/**
 * Game information with additional data
 */
export type ExpandedGame = Game & {
  names: Omit<client.AlternateGameName, "gameId">[];
};

/**
 * Unique ID of a game. Equal to that game's ID on BoardGameGeek.
 */
export type GameId = number;
