import GameCollection from "@/components/GameCollection/GameCollection";
import { prisma } from "@/db";
import { getMultipleCollectionStatusOfFriends } from "@/selectors/collections";
import { findFriendCollection } from "@/utility/collections";
import { getServerUser } from "@/utility/serverSession";
import { Game } from "@prisma/client";

export default async function Collection() {
  const user = await getServerUser();
  const gameCollection = await prisma.gameCollection.findMany({
    where: { userId: user.id },
    include: { game: true },
  });
  const friendCollections = await getMultipleCollectionStatusOfFriends(
    gameCollection.map((g) => g.gameId),
    user.id
  );
  return (
    <GameCollection
      games={gameCollection
        .sort((a, b) => (a.game.name > b.game.name ? 1 : -1))
        .map(({ game, own, wantToPlay, wishlist }) => ({
          game: cleanGame(game),
          status: { own, wantToPlay, wishlist },
          friendCollections: findFriendCollection(game.id, friendCollections),
        }))}
      showFriendCollection={true}
    />
  );
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}
