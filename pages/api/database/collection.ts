import { prisma } from "@/db";
import { fetchGames } from "@/utility/games";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface CollectionPost {
  game: string;
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
    return res.status(401).send({});
  } else if (req.method === "GET") {
    const user = session.user as UserProfile;
    const userProfile = await prisma.userProfile.findUnique({
      where: { email: user.email as string },
      include: { games: { include: { game: true } } },
    });
    return res.status(200).json(userProfile?.games);
  } else if (req.method === "POST") {
    const user = session.user as UserProfile;
    const userProfile = await prisma.userProfile.findUnique({
      where: { email: user.email as string },
    });
    if (!userProfile) {
      return res.status(500).json({ success: false });
    }
    //TODO validation
    const parameters = JSON.parse(req.body) as CollectionPost;
    const gameId = Number.parseInt(parameters.game);
    const game = await fetchGames(gameId);
    await prisma.gameCollection.upsert({
      where: {
        userId_gameId: {
          gameId: gameId,
          userId: userProfile.id,
        },
      },
      update: {
        ...getCollectionStatusPartial(parameters),
      },
      create: {
        userId: userProfile.id,
        gameId: gameId,
        own: !!parameters.own,
        wantToPlay: !!parameters.wantToPlay,
        wishlist: !!parameters.wishlist,
      },
    });
    return res.status(200).json({ success: true });
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
