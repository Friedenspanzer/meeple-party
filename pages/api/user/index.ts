import { prisma } from "@/db";
import { defaultUserPreferences } from "@/lib/types/userProfile";
import { withUser } from "@/lib/utility/apiAuth";
import { Prisma, User } from "@prisma/client";
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
      if (extendedDetails) {
        res.status(200).json(extendedDetails);
      } else {
        res.status(404).send({});
      }
    } else if (req.method === "PATCH") {
      const newUserDetails = updatedUserDetails(user, req.body);
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

export function cleanUserDetails(user: User): User {
  const preferences = {
    ...defaultUserPreferences,
    ...(user.preferences as Prisma.JsonObject),
  };

  return {
    ...user,
    realName: preferences.showRealNameInProfile ? user.realName : null,
    place: preferences.showPlaceInProfile ? user.place : null,
  };
}

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
