import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  if (req.method === "GET") {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: { games: { include: { game: true } } },
    });
    return res.status(200).json(userProfile?.games);
  }
});
