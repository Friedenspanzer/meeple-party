import { prisma } from "@/db";
import { RelationshipType } from "@/lib/types/relationship";
import { withUser } from "@/lib/utility/apiAuth";
import { normalizeRelationship } from "@/selectors/relationships";
import {
    RelationshipType as PrismaRelationshipType,
    User,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
    const targetUserId = getUserProfileId(req);

    if (req.method === "GET") {
      const normalizedRelationships = await findNormalizedRelationships(
        user.id,
        targetUserId
      );
      res.status(200).json(normalizedRelationships);
    } else if (req.method === "DELETE") {
      await prisma.relationship.deleteMany({
        where: {
          OR: [
            {
              senderId: targetUserId,
              recipientId: user.id,
              type: PrismaRelationshipType.FRIEND_REQUEST,
            },
            {
              senderId: user.id,
              recipientId: targetUserId,
              type: PrismaRelationshipType.FRIEND_REQUEST,
            },
            {
              senderId: user.id,
              recipientId: targetUserId,
              type: PrismaRelationshipType.FRIENDSHIP,
            },
            {
              senderId: targetUserId,
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
        targetUserId
      );
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
              senderId: targetUserId,
            },
          },
          data: { type: PrismaRelationshipType.FRIENDSHIP },
        });
        return res.status(200).send({});
      }
    } else if (req.method === "POST") {
      const normalizedRelationships = await findNormalizedRelationships(
        user.id,
        targetUserId
      );
      if (normalizedRelationships.length > 0) {
        throw new Error(
          "It's not possible to send a friend request to someone you already have a relationship to."
        );
      }
      await prisma.relationship.create({
        data: {
          senderId: user.id,
          recipientId: targetUserId,
          type: PrismaRelationshipType.FRIEND_REQUEST,
        },
      });
      return res.status(200).send({});
    } else {
      res.status(405).send({});
    }
  } catch (e) {
    console.error(e);
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
