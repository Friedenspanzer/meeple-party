import * as client from "@prisma/client";

/**
 * @deprecated This type should be replaced by the Data Layer V2 version
 */
export type Game = Omit<client.Game, "updatedAt">;

/**
 * @deprecated This type should be replaced by the Data Layer V2 version
 */
export interface BggGame extends Game {
  description: string;
  designers: string[];
  artists: string[];
  age: number;
}
