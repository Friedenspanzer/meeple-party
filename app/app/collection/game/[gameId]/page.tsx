import { XMLParser } from "fast-xml-parser";
import Image from "next/image";

const DAILY = 60 * 60 * 24;

interface Game {
  name: string;
  description: string;
  thumbnail: string;
  image: string;
  year: number;
  designers: string[];
  artists: string[];
}

export default async function Game({ params }: { params: { gameId: number } }) {
  const game = await fetchGameData(params.gameId);
  return (
    <>
      <h1>{game.name}</h1>
      <Image src={game.image} width="300" height="300" alt={game.name} />
      <p>
        Designers:
        <ul>
          {game.designers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </p>
      <p>
        Artists:
        <ul>
          {game.artists.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </p>
      <p dangerouslySetInnerHTML={{ __html: game.description }}></p>
    </>
  );
}

async function fetchGameData(gameId: number): Promise<Game> {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  //TODO Check if this is a boardgame, the API actually returns RPGs and presumably videogames m)
  return fetch(`https://api.geekdo.com/xmlapi/boardgame/${gameId}`, {
    next: { revalidate: DAILY },
  })
    .then((response) => response.text())
    .then((xml) => parser.parse(xml))
    .then((structuredData) => structuredData.boardgames.boardgame)
    .then((bggGame) => {
      console.log(bggGame);
      return bggGame;
    })
    .then((bggGame) => convertGame(bggGame));
}

function convertGame(bggGame: any): Game {
  return {
    name: getPrimaryName(bggGame),
    description: bggGame.description,
    thumbnail: bggGame.thumbnail,
    image: bggGame.image,
    year: bggGame.yearpublished,
    designers: getDesigners(bggGame),
    artists: getArtists(bggGame),
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
  if (Array.isArray(bggGame.boardgamedesigner)) {
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
