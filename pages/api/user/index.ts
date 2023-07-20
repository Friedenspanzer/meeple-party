import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { Game, Prisma, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
    if (req.method === "GET") {
      const extendedDetails = await prisma.user.findUnique({
        where: { id: user.id },
        include: { favorites: true },
      });
      res.status(200).json(extendedDetails);
    } else if (req.method === "PATCH") {
      const newUserDetails = updatedUserDetails(user, JSON.parse(req.body));
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...newUserDetails,
          profileComplete: isProfileComplete(newUserDetails),
        },
      });
      res.status(200).send({});
    } else if (req.method === "DELETE") {
      await prisma.user.delete({ where: { id: user.id } });
      res.status(200).send({});
    } else {
      res.status(405).send({});
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e });
  }
});

function updatedUserDetails(user: User, requestObject: any) {
  return {
    bggName: requestObject.bggName ? requestObject.bggName : user.bggName,
    image: requestObject.image ? requestObject.image : user.image,
    name: requestObject.name ? requestObject.name : user.name,
    realName: requestObject.realName ? requestObject.realName : user.realName,
    place: requestObject.place ? requestObject.place : user.place,
    about: requestObject.about ? requestObject.about : user.about,
    preferences: (requestObject.preferences
      ? requestObject.preferences
      : user.preferences) as Prisma.JsonObject,
    favorites: requestObject.favorites
      ? {
          set: requestObject.favorites.map((f: number) => ({
            id: f,
          })),
        }
      : undefined,
  };
}

function isProfileComplete(user: Partial<User>): boolean {
  return !!user.name && user.name.length > 0;
}
