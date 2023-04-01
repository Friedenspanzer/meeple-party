import {
  GameCollection,
  StatusByUser,
  UserGameCollection,
} from "@/datatypes/collection";
import { Game as CleanGame } from "@/datatypes/game";
import { PrivateUser } from "@/datatypes/userProfile";
import { prisma } from "@/db";
import {
  Game,
  GameCollection as PrismaGameCollection,
  RelationshipType,
  User,
} from "@prisma/client";

export async function getCollection(userId: string): Promise<GameCollection[]> {
  const result = await prisma.gameCollection.findMany({
    where: { userId },
    include: { game: true, user: true },
  });
  return result.map((r) => ({
    game: cleanGame(r.game),
    status: {
      own: r.own,
      wantToPlay: r.wantToPlay,
      wishlist: r.wishlist,
    },
  }));
}

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

export async function getAllGamesOfFriends(
  userId: string
): Promise<UserGameCollection[]> {
  const result = await prisma.gameCollection.findMany({
    where: {
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
    include: { user: true, game: true },
  });
  return result.map((r) => ({
    user: r.user,
    game: cleanGame(r.game),
    status: {
      own: r.own,
      wantToPlay: r.wantToPlay,
      wishlist: r.wishlist,
    },
  }));
}

function convertToStatusByUser(
  dbResult: (PrismaGameCollection & {
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

function cleanGame(uncleanGame: Game): CleanGame {
  const { updatedAt, ...cleanGame } = uncleanGame;
  return cleanGame;
}
