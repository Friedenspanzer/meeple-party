import { prisma } from "@/db";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RelationshipType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserProfile, normalizeRelationship } from "./utility";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session) {
    res.status(401).send({});
  } else {
    try {
      const userProfile = await getUserProfile(session);
      const targetUserProfileId = getUserProfileId(req);

      if (req.method === "GET") {
        const relationships = await prisma.relationship.findMany({
          where: {
            OR: [
              { recipientId: userProfile.id, senderId: targetUserProfileId },
              { recipientId: targetUserProfileId, senderId: userProfile.id },
            ],
          },
          include: {
            recipient: true,
            sender: true,
          },
        });

        const normalizedRelationships = relationships.map((r) =>
          normalizeRelationship(r, userProfile.id)
        );

        res.status(200).json(normalizedRelationships);
      } else if (req.method === "DELETE") {
        await prisma.relationship.deleteMany({
          where: {
            OR: [
              {
                senderId: targetUserProfileId,
                recipientId: userProfile.id,
                type: RelationshipType.FRIEND_REQUEST,
              },
              {
                senderId: userProfile.id,
                recipientId: targetUserProfileId,
                type: RelationshipType.FRIEND_REQUEST,
              },
              {
                senderId: userProfile.id,
                recipientId: targetUserProfileId,
                type: RelationshipType.FRIENDSHIP,
              },
              {
                senderId: targetUserProfileId,
                recipientId: userProfile.id,
                type: RelationshipType.FRIENDSHIP,
              },
            ],
          },
        });
        return res.status(200).json({});
      } else {
        res.status(405).send({});
      }
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  }
});

function getUserProfileId(req: NextApiRequest): number {
  const { userProfileId } = req.query;
  if (!userProfileId || Array.isArray(userProfileId)) {
    throw new Error("User Profile ID format error");
  }
  //TODO Validation
  return Number.parseInt(userProfileId);
}
