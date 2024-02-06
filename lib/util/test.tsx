import {
  generateArray,
  generateBoolean,
  generateDate,
  generateGame,
} from "@/utility/test";
import { Game as ServerGame } from "@prisma/client";
import { Collection } from "../datatypes/client/collection";
import { Game } from "../datatypes/client/game";
import { UserId } from "../datatypes/client/userProfile";

export function ObjectData({ object }: { object: object }) {
  return (
    <>
      {Object.entries(object).map(([key, value]) => (
        <div data-testid={key} key={key}>
          {JSON.stringify(value)}
        </div>
      ))}
    </>
  );
}

export function generateCollection(userId: UserId): {
  collection: Collection;
  games: Game[];
} {
  const games = generateArray(generateGame);
  const randomGames = () => pickRandom(games).map((g) => g.id);
  const collection = {
    user: userId,
    own: randomGames(),
    wantToPlay: randomGames(),
    wishlist: randomGames(),
  };

  return {
    games,
    collection,
  };
}

export function convertClientGame(game: Game): ServerGame {
  return {
    ...game,
    thumbnail: game.thumbnail || null,
    image: game.image || null,
    BGGRank: game.BGGRank || null,
    BGGRating: game.BGGRating || null,
    updatedAt: generateDate(),
  };
}

export function pickRandom<T>(arr: T[]): T[] {
  return arr.filter(generateBoolean);
}
