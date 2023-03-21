import * as client from '@prisma/client'

export type Game = Omit<client.Game, "updatedAt">;

export interface GameExtended extends Game {
  description: string;
  designers: string[];
  artists: string[];
}

