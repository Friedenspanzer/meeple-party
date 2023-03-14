import { RelationshipType } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import {
  RelationshipType as PrismaRelationshipType,
  User,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { normalizeRelationship } from "./utility";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
    const targetUserProfileId = getUserProfileId(req);

    if (req.method === "GET") {
      const normalizedRelationships = await findNormalizedRelationships(
        user.id,
        targetUserProfileId
      );
      res.status(200).json(normalizedRelationships);
    } else if (req.method === "DELETE") {
      await prisma.relationship.deleteMany({
        where: {
          OR: [
            {
              senderId: targetUserProfileId,
              recipientId: user.id,
              type: PrismaRelationshipType.FRIEND_REQUEST,
            },
            {
              senderId: user.id,
              recipientId: targetUserProfileId,
              type: PrismaRelationshipType.FRIEND_REQUEST,
            },
            {
              senderId: user.id,
              recipientId: targetUserProfileId,
              type: PrismaRelationshipType.FRIENDSHIP,
            },
            {
              senderId: targetUserProfileId,
              recipientId: user.id,
              type: PrismaRelationshipType.FRIENDSHIP,
            },
          ],
        },
      });
      return res.status(200).json({});
    } else if (req.method === "PATCH") {
      const normalizedRelationships = await findNormalizedRelationships(
        user.id,
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
              recipientId: user.id,
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
});

function getUserProfileId(req: NextApiRequest): string {
  const { userProfileId } = req.query;
  if (!userProfileId || Array.isArray(userProfileId)) {
    throw new Error("User Profile ID format error");
  }
  //TODO Validation
  return userProfileId;
}

async function findNormalizedRelationships(selfId: string, otherId: string) {
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
