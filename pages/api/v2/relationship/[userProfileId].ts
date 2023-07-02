import { Relationship } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { normalizeRelationship } from "@/selectors/relationships";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandling, withUser } from "../utility";
import { ApiError, ApiErrorMethodUnknown } from "../types";

export interface RelationshipGetResult {
  normalizedRelationship: Relationship | null;
}

export default withErrorHandling(
  withUser(async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
    user: User
  ) {
    const targetUserId = getUserProfileId(req);

    if (req.method === "GET") {
      const normalizedRelationships = await findNormalizedRelationships(
        user.id,
        targetUserId
      );
      if (normalizedRelationships.length > 1) {
        throw new ApiError("More than one relationship found", 500);
      } else if (normalizedRelationships.length === 0) {
        throw new ApiError(
          `You don't have a relationship with user ${targetUserId}`,
          404
        );
      } else {
        res.status(200).json({
          normalizedRelationship: normalizedRelationships[0],
        } as RelationshipGetResult);
      }
    } else {
      throw new ApiErrorMethodUnknown();
    }
  })
);

function getUserProfileId(req: NextApiRequest): string {
  const { userProfileId } = req.query;

  if (
    !userProfileId ||
    Array.isArray(userProfileId) ||
    typeof userProfileId !== "string" ||
    userProfileId.length < 20 ||
    userProfileId.length > 40
  ) {
    throw new Error("User Profile ID format error");
  }

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
