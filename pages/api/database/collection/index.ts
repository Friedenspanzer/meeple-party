import { prisma } from "@/db";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { NextApiRequest, NextApiResponse } from "next";

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
  }
});