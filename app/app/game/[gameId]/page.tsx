import Image from "next/image";
import { fetchGames } from "@/utility/games";
import { notFound } from "next/navigation";

export default async function Game({ params }: { params: { gameId: string } }) {
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  try {
    const games = await fetchGames(id);
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
    console.error("Error fetching game data", e);
    notFound();
  }
}
