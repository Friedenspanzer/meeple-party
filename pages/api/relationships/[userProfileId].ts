import { RelationshipType } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { RelationshipType as PrismaRelationshipType } from "@prisma/client";
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
        const normalizedRelationships = await findNormalizedRelationships(
          userProfile.id,
          targetUserProfileId
        );
        res.status(200).json(normalizedRelationships);
      } else if (req.method === "DELETE") {
        await prisma.relationship.deleteMany({
          where: {
            OR: [
              {
                senderId: targetUserProfileId,
                recipientId: userProfile.id,
                type: PrismaRelationshipType.FRIEND_REQUEST,
              },
              {
                senderId: userProfile.id,
                recipientId: targetUserProfileId,
                type: PrismaRelationshipType.FRIEND_REQUEST,
              },
              {
                senderId: userProfile.id,
                recipientId: targetUserProfileId,
                type: PrismaRelationshipType.FRIENDSHIP,
              },
              {
                senderId: targetUserProfileId,
                recipientId: userProfile.id,
                type: PrismaRelationshipType.FRIENDSHIP,
              },
            ],
          },
        });
        return res.status(200).json({});
      } else if (req.method === "PATCH") {
        const normalizedRelationships = await findNormalizedRelationships(
          userProfile.id,
          targetUserProfileId
        );
        console.log(normalizedRelationships);
        if (
          normalizedRelationships.length > 1 ||
          normalizedRelationships[0].type !==
            RelationshipType.FRIEND_REQUEST_RECEIVED
        ) {
          return res.status(401).send({});
        } else {
          await prisma.relationship.update({
            where: {
              senderId_recipientId: {
                recipientId: userProfile.id,
                senderId: targetUserProfileId,
              },
            },
            data: { type: PrismaRelationshipType.FRIENDSHIP },
          });
          return res.status(200).send({});
        }
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

async function findNormalizedRelationships(selfId: number, otherId: number) {
  const relationships = await prisma.relationship.findMany({
    where: {
      OR: [
        { recipientId: selfId, senderId: otherId },
        { recipientId: otherId, senderId: selfId },
      ],
    },
    include: {
      recipient: true,
      sender: true,
    },
  });

  return relationships.map((r) => normalizeRelationship(r, selfId));
}
