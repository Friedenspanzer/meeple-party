import { Game, GameExtended } from "@/datatypes/game";
import { XMLParser } from "fast-xml-parser";
import { PrismaClient } from "@prisma/client";
import entities from "entities";

const prisma = new PrismaClient();

const DEV = process.env.NODE_ENV === "development";

const MONTHLY = 30 * 24 * 60 * 60;
const DAILY = 60 * 60 * 24;

export type GameIds = number | number[];

export async function fetchGames(gameIds: GameIds): Promise<Game[]> {
  const ids = Array.isArray(gameIds) ? gameIds : [gameIds];

  const gamesFromDatabase = await prisma.game.findMany({
    where: {
      id: { in: ids },
    },
  });
  const staleIds = gamesFromDatabase
    .filter(
      (g) =>
        !g.updatedAt ||
        (Date.now().valueOf() - g.updatedAt.valueOf()) / 1000 > getUpdateInterval()
    )
    .map((g) => g.id);

  const missingIds = ids.filter(
    (id) => !gamesFromDatabase.find((g) => g.id === id)
  );

  //TODO Update fetchGameData to fetch more than one game at once
  const missingGames = (await Promise.all(missingIds.map(fetchGameData))).map(
    convertForDataBase
  );
  const staleGames = (await Promise.all(staleIds.map(fetchGameData))).map(
    convertForDataBase
  );

  if (!!missingGames && missingGames.length > 0) {
    if (DEV) {
      console.log(
        "Inserting missing games",
        missingGames.map((g) => `${[g.id]} ${g.name}}`)
      );
    }
    await prisma.game.createMany({ data: missingGames });
  }
  if (!!staleGames && staleGames.length > 0) {
    if (DEV) {
      console.log(
        "Updating stale games",
        staleGames.map((g) => `${[g.id]} ${g.name}}`)
      );
    }
    for (let staleGame of staleGames) {
      await prisma.game.update({
        data: staleGame,
        where: { id: staleGame.id },
      });
    }
  }

  return [...gamesFromDatabase, ...missingGames];
}

function convertForDataBase(game: GameExtended) {
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
    BGGRating: game.BGGRating
  };
}

export async function fetchGamesExtended(
  gameIds: GameIds
): Promise<GameExtended[]> {
  if (!Array.isArray(gameIds)) {
    return Promise.all([fetchGameData(gameIds)]);
  } else {
    return Promise.all(gameIds.map((id) => fetchGameData(id)));
  }
}

async function fetchGameData(gameId: number): Promise<GameExtended> {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  return fetch(`https://api.geekdo.com/xmlapi/boardgame/${gameId}&stats=1`, {
    next: { revalidate: DAILY },
  })
    .then((response) => response.text())
    .then((xml) => parser.parse(xml))
    .then((bggGame) => bggGame.boardgames)
    .then(checkData)
    .then(convertGame)
    .catch((e) => {
      throw e;
    });
}

function checkData(boardgames: any) {
  if (!!boardgames.boardgame.error) {
    throw Error(`BGG API error: ${boardgames.boardgame.error["@_message"]}`);
  }
  if (!!boardgames.boardgame["@_subtypemismatch"]) {
    throw Error(
      `Item with ID ${boardgames.boardgame["@_objectid"]} is not a boardgame.`
    );
  }
  return boardgames;
}

function convertGame(boardgames: any): GameExtended {
  return {
    id: Number.parseInt(boardgames.boardgame["@_objectid"]),
    name: entities.decodeHTML(getPrimaryName(boardgames.boardgame)),
    description: entities.decodeHTML(boardgames.boardgame.description),
    thumbnail: boardgames.boardgame.thumbnail,
    image: boardgames.boardgame.image,
    year: boardgames.boardgame.yearpublished,
    designers: getDesigners(boardgames.boardgame),
    artists: getArtists(boardgames.boardgame),
    playingTime: boardgames.boardgame.playingtime,
    minPlayers: boardgames.boardgame.minplayers,
    maxPlayers: boardgames.boardgame.maxplayers,
    weight: getWeight(boardgames.boardgame),
    BGGRating: getRating(boardgames.boardgame),
  };
}

function getPrimaryName(bggGame: any): string {
  if (Array.isArray(bggGame.name)) {
    let found = bggGame.name[0]["#text"];
    bggGame.name.forEach((name: any) => {
      if (!!name["@_primary"]) {
        found = name["#text"];
      }
    });
    return found;
  } else {
    return bggGame.name["#text"];
  }
}

function getDesigners(bggGame: any): string[] {
  if (!bggGame.boardgamedesigner) {
    return [];
  } else if (Array.isArray(bggGame.boardgamedesigner)) {
    return bggGame.boardgamedesigner.map((designer: any) => designer["#text"]);
  } else {
    return [bggGame.boardgamedesigner["#text"]];
  }
}

function getArtists(bggGame: any): string[] {
  if (!bggGame.boardgameartist) {
    return [];
  } else if (Array.isArray(bggGame.boardgameartist)) {
    return bggGame.boardgameartist.map((artist: any) => artist["#text"]);
  } else {
    console.log(bggGame.boardgameartist);
    return [bggGame.boardgameartist["#text"]];
  }
}

function getRating(bggGame: any): number {
  if (
    !bggGame.statistics ||
    !bggGame.statistics.ratings ||
    !bggGame.statistics.ratings.bayesaverage
  ) {
    return 0.0;
  } else {
    return Number.parseFloat(bggGame.statistics.ratings.bayesaverage);
  }
}

function getWeight(bggGame: any): number {
  if (
    !bggGame.statistics ||
    !bggGame.statistics.ratings ||
    !bggGame.statistics.ratings.averageweight
  ) {
    return 0.0;
  } else {
    return Number.parseFloat(bggGame.statistics.ratings.averageweight);
  }
}

function getUpdateInterval() {
  if (process.env.BGG_UPDATE_INTERVAL) {
    return Number.parseInt(process.env.BGG_UPDATE_INTERVAL)
  } else {
    return MONTHLY;
  }
}