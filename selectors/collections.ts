import { StatusByUser } from "@/datatypes/collection";
import { PrivateUser } from "@/datatypes/userProfile";
import { prisma } from "@/db";
import { GameCollection, RelationshipType, User } from "@prisma/client";

export async function getCollectionStatusOfFriends(
  gameId: number,
  userId: string
): Promise<StatusByUser> {
  const result = await prisma.gameCollection.findMany({
    where: {
      gameId,
      user: {
        OR: [
          {
            receivedRelationships: {
              some: {
                senderId: userId,
                type: RelationshipType.FRIENDSHIP,
              },
            },
          },
          {
            sentRelationships: {
              some: {
                recipientId: userId,
                type: RelationshipType.FRIENDSHIP,
              },
            },
          },
        ],
      },
    },
    include: { user: true },
  });
  return convertToStatusByUser(result);
}

function convertToStatusByUser(
  dbResult: (GameCollection & {
    user: User;
  })[]
): StatusByUser {
  return {
    own: dbResult.filter((r) => r.own).map((r) => convertToPrivateUser(r.user)),
    wishlist: dbResult
      .filter((r) => r.wishlist)
      .map((r) => convertToPrivateUser(r.user)),
    wantToPlay: dbResult
      .filter((r) => r.wantToPlay)
      .map((r) => convertToPrivateUser(r.user)),
  };
}

function convertToPrivateUser(dbUser: User): PrivateUser {
  const { email, emailVerified, bggName, profileComplete, ...user } = dbUser;
  return user;
}
