import { ExpandedGame, Game, GameId } from "@/datatypes/game";
import { prisma } from "@/db";
import * as client from "@prisma/client";
import { partition } from "./array";
import { getBggGames } from "./bgg";
import { getWikidataInfo } from "./wikidata";

const DEV = process.env.NODE_ENV === "development";

const DAILY = 24 * 60 * 60;

/**
 * Gets complete data for all requested games. Handles updating of stale data.
 *
 * @param gameIds List of IDs of the games to fetch data for.
 * @returns Complete data of all games that are found. Non-existant IDs will be discarded silently.
 */
export async function getGameData(gameIds: GameId[]): Promise<ExpandedGame[]> {
  const gamesFromDatabase = await getFromDatabase(gameIds);

  const [fresh, stale] = partition(gamesFromDatabase, isFresh);
  const missingIds = gameIds.filter(
    (id) => !gamesFromDatabase.find((g) => g.id === id)
  );

  const freshFromDatabase = convertGamesFromDatabase(fresh);
  const freshData = await getFreshData([
    ...stale.map((s) => s.id),
    ...missingIds,
  ]);
  const [newData, updatedData] = partition(freshData, (d) =>
    missingIds.includes(d.id)
  );

  await updateInDatabase(updatedData);
  await addToDatabase(newData);

  if (DEV && updatedData.length > 0) {
    console.log(
      "Updated stale games",
      updatedData.map((g) => ({ id: g.id, name: g.name }))
    );
  }

  if (DEV && newData.length > 0) {
    console.log(
      "Saved new game data",
      newData.map((g) => ({ id: g.id, name: g.name }))
    );
  }

  return [...freshFromDatabase, ...updatedData, ...newData];
}

type PrismaResult = client.Game & {
  alternateNames: client.AlternateGameName[];
};

async function getFromDatabase(gameIds: GameId[]): Promise<PrismaResult[]> {
  const result = await prisma.game.findMany({
    where: {
      id: { in: gameIds },
    },
    include: {
      alternateNames: true,
    },
  });
  return result;
}

function convertGamesFromDatabase(database: PrismaResult[]): ExpandedGame[] {
  return database.map((d) => ({ ...d, names: d.alternateNames }));
}

function isFresh(game: PrismaResult) {
  return (
    !!game.updatedAt &&
    (Date.now().valueOf() - game.updatedAt.valueOf()) / 1000 >
      getUpdateInterval()
  );
}

async function getFreshData(gameIds: GameId[]): Promise<ExpandedGame[]> {
  const [bggData, wikidataData] = await Promise.all([
    getBggGames(gameIds),
    getWikidataInfo(gameIds),
  ]);

  return bggData.map((game) => {
    const wikidata = wikidataData.find((d) => d.gameId === game.id);
    return {
      ...game,
      wikidataId: wikidata?.wikidataId || null,
      names: wikidata?.names || [],
    };
  });
}

async function updateInDatabase(games: ExpandedGame[]) {
  for (let game of games) {
    await prisma.game.update({
      data: createPrismaQueryData(game),
      include: {
        alternateNames: true,
      },
      where: { id: game.id },
    });
  }
}

async function addToDatabase(games: ExpandedGame[]) {
  for (let game of games) {
    await prisma.game.create({
      data: createPrismaQueryData(game),
    });
  }
}

function createPrismaQueryData(game: ExpandedGame) {
  const cleaned = cleanForDatabase(game);
  return {
    ...cleaned,
    alternateNames: {
      connectOrCreate: game.names?.map((name) => ({
        where: {
          gameId_language: { gameId: game.id, language: name.language },
        },
        create: { language: name.language, name: name.name },
      })),
    },
  };
}

function cleanForDatabase(game: ExpandedGame): Game {
  return {
    BGGRank: game.BGGRank,
    BGGRating: game.BGGRating,
    id: game.id,
    image: game.image,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    name: game.name,
    playingTime: game.playingTime,
    thumbnail: game.thumbnail,
    weight: game.weight,
    wikidataId: game.wikidataId,
    year: game.year,
  };
}

function getUpdateInterval() {
  if (process.env.BGG_UPDATE_INTERVAL) {
    return Number.parseInt(process.env.BGG_UPDATE_INTERVAL);
  } else {
    return DAILY;
  }
}
