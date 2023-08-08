import GameCollection from "@/components/GameCollection/GameCollection";
import PrefetchedGameData from "@/components/Prefetches/PrefetchedGameData";
import { Game } from "@/datatypes/game";
import { prisma } from "@/db";
import { getMultipleCollectionStatusOfFriends } from "@/selectors/collections";
import { findFriendCollection } from "@/utility/collections";
import { emptyFilter } from "@/utility/filter";
import { fetchGames } from "@/utility/games";
import { getServerUser } from "@/utility/serverSession";

export const metadata = {
  title: "Your collection",
};

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
    <PrefetchedGameData data={games}>
      <GameCollection
        games={gameCollection.map(({ gameId, own, wantToPlay, wishlist }) => ({
          game: getGame(games, gameId),
          status: { own, wantToPlay, wishlist },
          friendCollections: findFriendCollection(gameId, friendCollections),
        }))}
        defaultFilter={{ ...emptyFilter, collectionStatus: { own: true } }}
        showFriendCollection={true}
      />
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
