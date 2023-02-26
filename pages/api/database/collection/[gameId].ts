import { prisma } from "@/db";
import { fetchGames } from "@/utility/games";
import { getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface CollectionStatus {
  own: undefined | boolean;
  wantToPlay: undefined | boolean;
  wishlist: undefined | boolean;
}

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).send("");
  } else if (req.method === "GET") {
    try {
      const gameId = getGameId(req);
      const userId = await getUserId(session);
      const collection = await prisma.gameCollection.findUnique({
        where: { userId_gameId: { gameId, userId } },
      });
      if (!collection) {
        return res.status(200).json(
          JSON.stringify({
            own: false,
            wishlist: false,
            wantToPlay: false,
          } as CollectionStatus)
        );
      }
      return res.status(200).json(
        JSON.stringify({
          own: collection.own,
          wishlist: collection.wishlist,
          wantToPlay: collection.wantToPlay,
        } as CollectionStatus)
      );
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  } else if (req.method === "POST") {
    const userId = await getUserId(session);
    try {
      const gameId = getGameId(req);
      const parameters = JSON.parse(req.body) as CollectionStatus;
      const game = await fetchGames(gameId);

      if (parameters.own || parameters.wantToPlay || parameters.wishlist) {
        await upsertStatus(gameId, userId, parameters);
      } else {
        await deleteStatus(gameId, userId);
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  }
});

function getCollectionStatusPartial(status: {
  own: undefined | boolean;
  wantToPlay: undefined | boolean;
  wishlist: undefined | boolean;
}): object {
  let ret = {};
  if (status.own !== undefined) {
    ret = { ...ret, own: status.own };
  }
  if (status.wantToPlay !== undefined) {
    ret = { ...ret, wantToPlay: status.wantToPlay };
  }
  if (status.wishlist !== undefined) {
    ret = { ...ret, wishlist: status.wishlist };
  }
  return ret;
}

function getGameId(req: NextApiRequest): number {
  let { gameId } = req.query;
  if (!gameId || Array.isArray(gameId)) {
    throw new Error("Game ID format error");
  }
  //TODO Validation
  return Number.parseInt(gameId);
}

async function getUserId(session: Session): Promise<number> {
  const user = session.user as UserProfile;
  const userProfile = await prisma.userProfile.findUnique({
    where: { email: user.email as string },
  });
  if (!userProfile) {
    throw new Error("Could not fetch User ID");
  }
  return userProfile.id;
}

async function upsertStatus(
  gameId: number,
  userId: number,
  status: CollectionStatus
) {
  await prisma.gameCollection.upsert({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
    },
    update: {
      ...getCollectionStatusPartial(status),
    },
    create: {
      userId,
      gameId,
      own: !!status.own,
      wantToPlay: !!status.wantToPlay,
      wishlist: !!status.wishlist,
    },
  });
}

async function deleteStatus(gameId: number, userId: number) {
  await prisma.gameCollection.delete({
    where: { userId_gameId: { gameId, userId } },
  });
}
