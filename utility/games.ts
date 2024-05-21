import { BggGame, Game } from "@/datatypes/game";
import { PrismaClient } from "@prisma/client";
import { getBggGames } from "./bgg";
import { getWikidataInfo } from "./wikidata";

const prisma = new PrismaClient();

const DEV = process.env.NODE_ENV === "development";

const MONTHLY = 30 * 24 * 60 * 60;

export async function fetchGames(gameIds: number[]): Promise<Game[]> {
  //TODO Add tests
  const gamesFromDatabase = await prisma.game.findMany({
    where: {
      id: { in: gameIds },
    },
  });

  const staleIds = gamesFromDatabase
    .filter(
      (g) =>
        !g.updatedAt ||
        (Date.now().valueOf() - g.updatedAt.valueOf()) / 1000 >
          getUpdateInterval()
    )
    .map((g) => g.id);

  const missingIds = gameIds.filter(
    (gameId) => !gamesFromDatabase.find((g) => g.id === gameId)
  );

  const missingGames = await getBggGames(missingIds);
  const staleGames = await getBggGames(staleIds);
  const freshGames = gamesFromDatabase.filter(
    (g) => !staleGames.find((s) => s.id === g.id)
  );

  let updatedGames: Game[] = [];

  if (missingGames && missingGames.length > 0) {
    if (DEV) {
      console.log(
        "Inserting missing games",
        missingGames.map((g) => `${[g.id]} ${g.name}}`)
      );
    }
    updatedGames = [...updatedGames, ...(await addToDatabase(missingGames))];
  }
  if (staleGames && staleGames.length > 0) {
    if (DEV) {
      console.log(
        "Updating stale games",
        staleGames.map((g) => `${[g.id]} ${g.name}`)
      );
    }
    updatedGames = [...updatedGames, ...(await updateInDatabase(staleGames))];
  }

  return [...freshGames, ...updatedGames];
}

async function addToDatabase(games: BggGame[]): Promise<Game[]> {
  const converted = games.map(convertForDataBase);
  const wikidata = await getWikidataInfo(converted);
  for (let game of converted) {
    const w = wikidata.find((w) => w.gameId === game.id);
    await prisma.game.create({
      data: {
        ...game,
        wikidataId: w?.wikidataId,
        alternateNames: {
          connectOrCreate: w?.names?.map((n) => ({
            where: {
              gameId_language: { gameId: game.id, language: n.language },
            },
            create: { language: n.language, name: n.name },
          })),
        },
      },
    });
  }
  return converted;
}

async function updateInDatabase(games: BggGame[]): Promise<Game[]> {
  const updated = games.map(convertForDataBase);
  const wikidata = await getWikidataInfo(updated);
  for (let game of updated) {
    const w = wikidata.find((w) => w.gameId === game.id);
    await prisma.game.update({
      data: {
        ...game,
        wikidataId: w?.wikidataId,
        alternateNames: {
          connectOrCreate: w?.names?.map((n) => ({
            where: {
              gameId_language: { gameId: game.id, language: n.language },
            },
            create: { language: n.language, name: n.name },
          })),
        },
      },
      include: {
        alternateNames: true,
      },
      where: { id: game.id },
    });
  }
  return updated;
}

function convertForDataBase(game: BggGame): Game {
  return {
    id: game.id,
    name: game.name,
    thumbnail: game.thumbnail,
    image: game.image,
    year: game.year,
    playingTime: game.playingTime,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    weight: game.weight,
    BGGRating: game.BGGRating,
    BGGRank: game.BGGRank,
    wikidataId: null,
  };
}

function getUpdateInterval() {
  if (process.env.BGG_UPDATE_INTERVAL) {
    return Number.parseInt(process.env.BGG_UPDATE_INTERVAL);
  } else {
    return MONTHLY;
  }
}
