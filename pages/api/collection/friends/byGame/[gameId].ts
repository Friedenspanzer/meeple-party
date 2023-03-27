import { PrivateUser, PublicUser } from "@/datatypes/userProfile";
import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { GameCollection, RelationshipType, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

export interface StatusByUser {
  own: PrivateUser[];
  wishlist: PrivateUser[];
  wantToPlay: PrivateUser[];
}

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  if (req.method === "GET") {
    try {
      const gameId = getGameId(req);
      const result = await prisma.gameCollection.findMany({
        where: {
          gameId,
          user: {
            OR: [
              {
                receivedRelationships: {
                  some: {
                    senderId: user.id,
                    type: RelationshipType.FRIENDSHIP,
                  },
                },
              },
              {
                sentRelationships: {
                  some: {
                    recipientId: user.id,
                    type: RelationshipType.FRIENDSHIP,
                  },
                },
              },
            ],
          },
        },
        include: { user: true },
      });
      res.status(200).json(convertToStatusByUser(result));
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: e });
    }
  }
});

function getGameId(req: NextApiRequest): number {
  const { gameId } = req.query;
  if (!gameId || Array.isArray(gameId) || !validator.isInt(gameId)) {
    throw new Error("Game ID format error");
  }
  return Number.parseInt(gameId);
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
