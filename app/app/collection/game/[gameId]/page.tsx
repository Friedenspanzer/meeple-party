import { XMLParser } from "fast-xml-parser";
import Image from "next/image";
import { GameExtended } from "@/datatypes/game";
import { fetchGames, fetchGamesExtended } from "@/utility/games";
import { notFound } from "next/navigation";

export default async function Game({ params }: { params: { gameId: string } }) {
  if (!Number.isInteger(params.gameId)) {
    notFound();
  }
  try {
    const games = await fetchGames(Number.parseInt(params.gameId));
    return (
      <>
        <h1>{games[0].name}</h1>
        {games[0].image && (
          <Image
            src={games[0].image}
            width="300"
            height="300"
            alt={games[0].name}
          />
        )}
      </>
    );
  } catch (e) {
    notFound();
  }
}
