import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
    if (req.method === "POST") {
      const newUserDetails = updatePartialUser(user, JSON.parse(req.body));
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...newUserDetails,
          profileComplete: isProfileComplete(newUserDetails),
        },
      });
      res.status(200).send({});
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
});

function updatePartialUser(user: User, requestObject: any): Partial<User> {
  return {
    bggName: !!requestObject.bggName ? requestObject.bggName : user.bggName,
    image: !!requestObject.image ? requestObject.image : user.image,
    name: !!requestObject.name ? requestObject.name : user.name,
    realName: !!requestObject.realName ? requestObject.realName : user.realName,
  };
}

function isProfileComplete(user: Partial<User>): boolean {
  return !!user.name && user.name.length > 0;
}
