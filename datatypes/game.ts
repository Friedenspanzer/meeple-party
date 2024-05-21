import * as client from "@prisma/client";

export type Game = Omit<client.Game, "updatedAt">;

export interface BggGame extends Omit<Game, "wikidataId"> {
  description: string;
  designers: string[];
  artists: string[];
  age: number;
}
