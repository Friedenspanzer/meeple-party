import { getCollectionStatusOfFriends } from "@/selectors/collections";
import { withUser } from "@/utility/apiAuth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  if (req.method === "GET") {
    try {
      const gameId = getGameId(req);
      res.status(200).json(await getCollectionStatusOfFriends(gameId, user.id));
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
