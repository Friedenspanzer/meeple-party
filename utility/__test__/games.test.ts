import { BggGame, ExpandedGame, Game, GameId } from "@/datatypes/game";
import { prismaMock } from "@/utility/prismaMock";
import * as client from "@prisma/client";
import { partition } from "../array";
import { getBggGames } from "../bgg";
import { getGameData } from "../games";
import {
  generateArray,
  generateBoolean,
  generateGame,
  generateNumber,
  generateString,
  objectMatcher,
} from "../test";
import { WikiDataInfo, getWikidataInfo } from "../wikidata";

jest.mock("../wikidata");
jest.mock("../bgg");

describe("getGameData", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("returns games in database", async () => {
    const ids = generateArray(generateNumber);
    const gamesInDatabase = generateGamesWithName(ids);
    gamesInDatabase.forEach((g) => (g.updatedAt = new Date(9999, 1, 1)));
    const expected = convertGamesFromDatabase(gamesInDatabase);

    const searchMock = prismaMock.game.findMany
      .calledWith(
        objectMatcher({
          where: {
            id: { in: ids },
          },
          include: {
            alternateNames: true,
          },
        })
      )
      .mockResolvedValue(gamesInDatabase);

    jest.mocked(getWikidataInfo).mockResolvedValue([]);
    jest.mocked(getBggGames).mockResolvedValue([]);

    const result = await getGameData(ids);

    expect(result).toEqual(expected);

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.game.update).toHaveBeenCalledTimes(0);
    expect(prismaMock.game.create).toHaveBeenCalledTimes(0);
  });
  it("returns stale games", async () => {
    const ids = generateArray(generateNumber);
    const [freshGamesInDatabase, staleGamesInDatabase] = partition(
      generateGamesWithName(ids),
      () => generateBoolean()
    );
    staleGamesInDatabase.forEach((g) => (g.updatedAt = new Date(1990, 1, 1)));
    freshGamesInDatabase.forEach((g) => (g.updatedAt = new Date(9999, 1, 1)));
    const updatedStaleGames = convertGamesFromDatabase(
      generateGamesWithName(staleGamesInDatabase.map((g) => g.id))
    );

    console.log(
      "Fresh IDs",
      freshGamesInDatabase.map((g) => g.id)
    );
    console.log(
      "Stale IDs",
      staleGamesInDatabase.map((g) => g.id)
    );

    const searchMock = prismaMock.game.findMany
      .calledWith(
        objectMatcher({
          where: {
            id: { in: ids },
          },
          include: {
            alternateNames: true,
          },
        })
      )
      .mockResolvedValue([...freshGamesInDatabase, ...staleGamesInDatabase]);

    prismaMock.game.update.mockResolvedValue({} as any);

    const wikidataMock = jest
      .mocked(getWikidataInfo)
      .mockResolvedValue(convertToWikiData(updatedStaleGames));

    const bggMock = jest
      .mocked(getBggGames)
      .mockResolvedValue(covertToBgg(updatedStaleGames));

    const result = await getGameData(ids);

    expect(wikidataMock).toHaveBeenCalledWith(
      staleGamesInDatabase.map((g) => g.id)
    );
    expect(bggMock).toHaveBeenCalledWith(staleGamesInDatabase.map((g) => g.id));

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.game.create).toHaveBeenCalledTimes(0);
    updatedStaleGames.forEach((g) =>
      expect(prismaMock.game.update).toHaveBeenCalledWith({
        data: createPrismaQueryData(g),
        include: {
          alternateNames: true,
        },
        where: { id: g.id },
      })
    );

    expect(result).toEqual([
      ...convertGamesFromDatabase(freshGamesInDatabase),
      ...updatedStaleGames,
    ]);
  });
});

type PrismaResult = client.Game & {
  alternateNames: client.AlternateGameName[];
};

function generateGamesWithName(gameIds: GameId[]): PrismaResult[] {
  return gameIds.map(generateGame).map((g) => ({
    ...g,
    alternateNames: generateNameList(g.id),
  }));
}

function convertGamesFromDatabase(database: PrismaResult[]): ExpandedGame[] {
  return database.map((d) => ({
    BGGRank: d.BGGRank,
    BGGRating: d.BGGRating,
    id: d.id,
    image: d.image,
    maxPlayers: d.maxPlayers,
    minPlayers: d.minPlayers,
    name: d.name,
    playingTime: d.playingTime,
    thumbnail: d.thumbnail,
    weight: d.weight,
    wikidataId: d.wikidataId,
    year: d.year,
    names: d.alternateNames,
  }));
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

function convertToWikiData(games: ExpandedGame[]): WikiDataInfo[] {
  return games.map((g) => ({
    gameId: g.id,
    wikidataId: g.wikidataId || undefined,
    names: g.names,
  }));
}
function covertToBgg(games: ExpandedGame[]): BggGame[] {
  return games.map((g) => ({
    ...g,
    description: generateString(),
    artists: generateArray(generateString),
    designers: generateArray(generateString),
    age: generateNumber(),
  }));
}

function generateNameList(gameId: GameId) {
  return generateArray(() => ({
    gameId,
    name: generateString(),
    language: generateString(2),
  }));
}
