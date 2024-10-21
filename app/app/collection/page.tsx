import { ExpandedGame } from "@/datatypes/game";
import { prisma } from "@/db";
import GameCollection from "@/feature/game-collection/components/GameCollection/GameCollection";
import { getTranslation } from "@/i18n";
import PrefetchedGameCollection from "@/lib/components/Prefetches/PrefetchedGameCollection";
import PrefetchedGameData from "@/lib/components/Prefetches/PrefetchedGameData";
import { getMultipleCollectionStatusOfFriends } from "@/selectors/collections";
import { findFriendCollection } from "@/utility/collections";
import { emptyFilter } from "@/utility/filter";
import { getGameData } from "@/utility/games";
import { getServerUser } from "@/utility/serverSession";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation("collection");
  return {
    title: t("Title"),
  };
}

export default async function Collection() {
  const user = await getServerUser();
  const gameCollection = await prisma.gameCollection.findMany({
    where: { userId: user.id },
  });
  const friendCollections = await getMultipleCollectionStatusOfFriends(
    gameCollection.map((g) => g.gameId),
    user.id
  );

  const games = await getGameData(gameCollection.map((c) => c.gameId));

  return (
    <PrefetchedGameData data={games}>
      <PrefetchedGameCollection data={gameCollection}>
        <GameCollection
          games={gameCollection.map(
            ({ gameId, own, wantToPlay, wishlist }) => ({
              game: getGame(games, gameId),
              status: { own, wantToPlay, wishlist },
              friendCollections: findFriendCollection(
                gameId,
                friendCollections
              ),
            })
          )}
          defaultFilter={{ ...emptyFilter, collectionStatus: { own: true } }}
          showFriendCollection={true}
        />
      </PrefetchedGameCollection>
    </PrefetchedGameData>
  );
}

function getGame(games: ExpandedGame[], gameId: number) {
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    throw new Error(
      "Game was in collection but could not be found in database"
    );
  }
  return game;
}
