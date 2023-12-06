import { prisma } from "@/db";
import { Game, Relationship, RelationshipType, User } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUser } from "../../../authentication";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const myUser = await getUser();

  const result = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      games: {
        include: {
          game: true,
        },
      },
      receivedRelationships: true,
      sentRelationships: true,
    },
  });

  if (!result) {
    return new Response("Unknown user id", { status: 404 });
  } else if (myself(myUser, result) || myFriend(myUser, result)) {
    const value: GameCollectionResult = {
      userId: result.id,
      collection: result.games.map((c) => ({
        game: c.game,
        own: c.own,
        wantToPlay: c.wantToPlay,
        wishlist: c.wishlist,
      })),
    };
    return NextResponse.json(value);
  } else {
    return new Response("Forbidden", { status: 403 });
  }
}

function myself(me: User, other: User) {
  return me.id === other.id;
}

function myFriend(
  me: User,
  other: User & {
    receivedRelationships: Relationship[];
    sentRelationships: Relationship[];
  }
) {
  return (
    other.receivedRelationships.some(
      (r) => r.senderId === me.id && r.type === RelationshipType.FRIENDSHIP
    ) ||
    other.sentRelationships.some(
      (r) => r.recipientId === me.id && r.type === RelationshipType.FRIENDSHIP
    )
  );
}

export interface GameCollectionResult {
  userId: string;
  collection: {
    game: Game;
    own: boolean;
    wantToPlay: boolean;
    wishlist: boolean;
  }[];
}
