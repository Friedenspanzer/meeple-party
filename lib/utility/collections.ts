import { StatusByUser } from "@/lib/types/collection";
import { GameCollection, User } from "@prisma/client";

export function findFriendCollection(
  gameId: number,
  friendCollections: (GameCollection & {
    user: User;
  })[]
): StatusByUser {
  const gameCollection = friendCollections.filter((c) => c.gameId === gameId);
  return {
    own: gameCollection.filter((c) => c.own).map((c) => c.user),
    wishlist: gameCollection.filter((c) => c.wishlist).map((c) => c.user),
    wantToPlay: gameCollection.filter((c) => c.wantToPlay).map((c) => c.user),
  };
}
