import GameCollection from "@/components/GameCollection/GameCollection";
import { prisma } from "@/db";
import { getServerUser } from "@/utility/serverSession";
import { Game } from "@prisma/client";

export default async function Collection() {
  const user = await getServerUser();
  const gameCollection = await prisma.gameCollection.findMany({
    where: { userId: user.id, own: true },
    include: { game: true },
  });
  return (
    <GameCollection
      games={gameCollection
        .sort((a, b) => (a.game.name > b.game.name ? 1 : -1))
        .map(({ game, own, wantToPlay, wishlist }) => ({
          game: cleanGame(game),
          status: { own, wantToPlay, wishlist },
        }))}
    />
  );
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}
