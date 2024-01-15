import { generateGame, generateNumber } from "@/utility/test";
import { convertGame } from "../game";

describe("Game", () => {
  it("converts a server game", () => {
    const serverGame = generateGame(generateNumber());
    const clientGame = {
      id: serverGame.id,
      maxPlayers: serverGame.maxPlayers,
      minPlayers: serverGame.minPlayers,
      name: serverGame.name,
      playingTime: serverGame.playingTime,
      weight: serverGame.weight,
      year: serverGame.year,
      BGGRank: serverGame.BGGRank,
      BGGRating: serverGame.BGGRating,
      image: serverGame.image,
      thumbnail: serverGame.thumbnail,
    };
    const convertedGame = convertGame(serverGame);
    expect(convertedGame).toEqual(clientGame);
  });
  it("replaces null with undefined", () => {
    const serverGame = {
      ...generateGame(generateNumber()),
      BGGRank: null,
      BGGRating: null,
      image: null,
      thumbnail: null,
    };
    const clientGame = {
      id: serverGame.id,
      maxPlayers: serverGame.maxPlayers,
      minPlayers: serverGame.minPlayers,
      name: serverGame.name,
      playingTime: serverGame.playingTime,
      weight: serverGame.weight,
      year: serverGame.year,
      BGGRank: undefined,
      BGGRating: undefined,
      image: undefined,
      thumbnail: undefined,
    };
    const convertedGame = convertGame(serverGame);
    expect(convertedGame).toEqual(clientGame);
  });
});
