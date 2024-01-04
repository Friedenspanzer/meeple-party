import UserProfilePage from "@/components/pages/profile/UserProfilePage";
import { prisma } from "@/db";
import { cleanUserDetails } from "@/pages/api/user";
import { getServerUser } from "@/utility/serverSession";
import {
  Game,
  GameCollection as PrismaGameCollection,
  Relationship,
  RelationshipType,
  User,
} from "@prisma/client";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";

export async function generateMetadata({
  params,
}: {
  params: { profileId: string };
}): Promise<Metadata> {
  const user = await getUser(params.profileId);
  if (!user?.profileComplete) {
    notFound();
  }
  return {
    title: user.name,
  };
}

type UserWithRelationships = User & {
  sentRelationships: Relationship[];
  receivedRelationships: Relationship[];
};

export default async function ProfilePage({
  params,
}: Readonly<{
  params: { profileId: string };
}>) {
  const loggedInUser = await getServerUser();
  const isMe = loggedInUser.id === params.profileId;

  const user = await getUser(params.profileId, loggedInUser.id);
  if (!user?.profileComplete) {
    notFound();
  }

  user.games.sort((a, b) => (a.game.name > b.game.name ? 1 : -1));
  const isFriend = getAllFriendIds(user).includes(loggedInUser.id);

  const myCollectionStatus = await prisma.gameCollection.findMany({
    where: {
      userId: loggedInUser.id,
      gameId: { in: user.games.map((g) => g.gameId) },
    },
  });

  return (
    <UserProfilePage
      user={user}
      isFriend={isFriend}
      isMe={isMe}
      favorites={user.favorites}
      collection={user.games.map(({ game }) => ({
        game: cleanGame(game),
        status: getStatus(game.id, myCollectionStatus),
      }))}
    />
  );
}

function getStatus(gameId: number, myCollection: PrismaGameCollection[]) {
  const relatedGame = myCollection.find((c) => c.gameId === gameId);
  if (!relatedGame) {
    return { own: false, wantToPlay: false, wishlist: false };
  } else {
    return {
      own: relatedGame.own,
      wantToPlay: relatedGame.wantToPlay,
      wishlist: relatedGame.wishlist,
    };
  }
}

function getAllFriendIds(user: UserWithRelationships): string[] {
  const sentFriendships = user.sentRelationships
    .filter((r) => r.type === RelationshipType.FRIENDSHIP)
    .map((r) => r.recipientId);
  const receivedFriendships = user.receivedRelationships
    .filter((r) => r.type === RelationshipType.FRIENDSHIP)
    .map((r) => r.senderId);
  return [...sentFriendships, ...receivedFriendships];
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}

const getUser = async (id: string, loggedInUserId?: string) => {
  const extendedUserData = await prisma.user.findUnique({
    where: { id },
    include: {
      receivedRelationships: true,
      sentRelationships: true,
      favorites: true,
      games: {
        where: {
          own: true,
        },
        include: {
          game: true,
        },
      },
    },
  });

  if (extendedUserData) {
    const {
      receivedRelationships,
      sentRelationships,
      favorites,
      games,
      ...userData
    } = extendedUserData;

    const isFriend =
      loggedInUserId &&
      getAllFriendIds(extendedUserData).includes(loggedInUserId);
    const isMe = loggedInUserId && extendedUserData.id === loggedInUserId;

    const clean = isMe || isFriend ? userData : cleanUserDetails(userData);

    return {
      receivedRelationships,
      sentRelationships,
      favorites,
      games,
      ...clean,
    };
  }

  return null;
};
