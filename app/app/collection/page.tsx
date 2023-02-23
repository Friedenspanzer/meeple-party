import GameBox from "@/components/GameBox/GameBox";
import { fetchGames } from "@/utility/games";

export default async function Collection() {
  const games = await fetchGames([
    224517, 174430, 341169, 295770, 342942, 366013, 316554,
  ]);
  return (
    <>
      <h1>Collection</h1>
      {games.map((g) => (
        <GameBox game={g} key={g.id} />
      ))}
    </>
  );
}
