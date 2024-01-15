import GameCollection from "@/components/GameCollection/GameCollection";
import PrefetchedGameCollection from "@/components/Prefetches/PrefetchedGameCollection";
import PrefetchedGameData from "@/components/Prefetches/PrefetchedGameData";
import { Game } from "@/datatypes/game";
import { prisma } from "@/db";
import { getTranslation } from "@/i18n";
import { getMultipleCollectionStatusOfFriends } from "@/selectors/collections";
import { findFriendCollection } from "@/utility/collections";
import { emptyFilter } from "@/utility/filter";
import { fetchGames } from "@/utility/games";
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

  const games = await fetchGames(gameCollection.map((c) => c.gameId));

  return (
    <PrefetchedGameData
      data={games.map((g) => ({
        ...g,
        thumbnail: g.thumbnail || undefined,
        image: g.image || undefined,
        BGGRank: g.BGGRank || undefined,
        BGGRating: g.BGGRating || undefined,
      }))}
    >
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

function getGame(games: Game[], gameId: number) {
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    throw new Error(
      "Game was in collection but could not be found in database"
    );
  }
  return game;
}
