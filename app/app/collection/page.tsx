import GameCollection from "@/components/GameCollection/GameCollection";
import PrefetchedGameData from "@/components/Prefetches/PrefetchedGameData";
import { prisma } from "@/db";
import { getMultipleCollectionStatusOfFriends } from "@/selectors/collections";
import { findFriendCollection } from "@/utility/collections";
import { emptyFilter } from "@/utility/filter";
import { getServerUser } from "@/utility/serverSession";
import { Game } from "@prisma/client";

export const metadata = {
  title: "Your collection",
};

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
    <PrefetchedGameData data={gameCollection.map((g) => g.game)}>
      <GameCollection
        games={gameCollection.map(({ game, own, wantToPlay, wishlist }) => ({
          game: cleanGame(game),
          status: { own, wantToPlay, wishlist },
          friendCollections: findFriendCollection(game.id, friendCollections),
        }))}
        defaultFilter={{ ...emptyFilter, collectionStatus: { own: true } }}
        showFriendCollection={true}
      />
    </PrefetchedGameData>
  );
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}
