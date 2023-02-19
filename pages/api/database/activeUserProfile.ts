import { prisma } from "@/db";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req, res);
    if (!!session) {
      const user = session.user as UserProfile;
      if (!user.email) {
        throw new Error("User from Auth0 does not have an E-Mail adress");
      }
      const userProfile = await prisma.userProfile.findUnique({
        where: { email: user.email as string },
      });
      return res.status(200).json(userProfile);
    } else {
      return res.status(401).send({});
    }
  } else if (req.method === "POST") {
    const userProfile = JSON.parse(req.body);
    const newProfile = await prisma.userProfile.upsert({
      where: { id: userProfile.id || -1 },
      create: {
        name: userProfile.name,
        realName: userProfile.realName,
        picture: userProfile.picture,
        email: userProfile.email,
      },
      update: userProfile,
    });
    return res.status(200).json(newProfile);
  } else {
    return res.status(405).send({});
  }
});
