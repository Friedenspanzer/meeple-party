import GameCollection from "@/components/GameCollection/GameCollection";
import { prisma } from "@/db";
import { getTranslation } from "@/i18n";
import { getMultipleCollectionStatusOfFriends } from "@/selectors/collections";
import { findFriendCollection } from "@/utility/collections";
import { emptyFilter } from "@/utility/filter";
import { getServerUser } from "@/utility/serverSession";
import { Game } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await getTranslation("collection");
  return {
    title: t("Title"),
  };
}

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
      games={gameCollection.map(({ game, own, wantToPlay, wishlist }) => ({
        game: cleanGame(game),
        status: { own, wantToPlay, wishlist },
        friendCollections: findFriendCollection(game.id, friendCollections),
      }))}
      defaultFilter={{ ...emptyFilter, collectionStatus: { own: true } }}
      showFriendCollection={true}
    />
  );
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}
