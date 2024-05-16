import { StatusByUser } from "@/datatypes/collection";
import { prisma } from "@/db";
import { myFriends } from "@/lib/queries/relationships";
import { NextResponse } from "next/server";
import validator from "validator";
import { getUser } from "../../../authentication";
import { normalizeRelationship } from "../../../utility";

export type FriendCollectionGetResult = StatusByUser;

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const user = await getUser();
    const gameId = getGameId(params.gameId);

    const friends = (
      await prisma.relationship.findMany({
        where: myFriends(user.id),
        include: { sender: true, recipient: true },
      })
    ).map((f) => normalizeRelationship(f, user.id).profile);

    if (friends.length === 0) {
      return NextResponse.json({
        own: [],
        wishlist: [],
        wantToPlay: [],
      } as FriendCollectionGetResult);
    }

    const friendCollections = await prisma.gameCollection.findMany({
      where: { userId: { in: friends.map((f) => f.id) }, gameId },
    });

    const own = friendCollections
      .filter((c) => c.own)
      .map((c) => friends.filter((f) => f.id === c.userId)[0]);
    const wantToPlay = friendCollections
      .filter((c) => c.wantToPlay)
      .map((c) => friends.filter((f) => f.id === c.userId)[0]);
    const wishlist = friendCollections
      .filter((c) => c.wishlist)
      .map((c) => friends.filter((f) => f.id === c.userId)[0]);

    const result: FriendCollectionGetResult = {
      own,
      wantToPlay,
      wishlist,
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 400 });
  }
}

function getGameId(input: string) {
  if (!validator.isNumeric(input)) {
    throw Error("Game ID format error");
  }
  const asInt = Number.parseInt(input);
  if (asInt < 0 || asInt > 999999999) {
    throw Error("Game ID format error");
  }
  return asInt;
}
