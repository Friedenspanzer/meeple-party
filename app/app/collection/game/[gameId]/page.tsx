import { XMLParser } from "fast-xml-parser";
import Image from "next/image";
import { GameExtended } from "@/datatypes/game";
import { fetchGames, fetchGamesExtended } from "@/utility/games";

export default async function Game({ params }: { params: { gameId: string } }) {
  const games = await fetchGames(Number.parseInt(params.gameId));
  return (
    <>
      <h1>{games[0].name}</h1>
      <Image src={games[0].image} width="300" height="300" alt={games[0].name} />
    </>
  );
}