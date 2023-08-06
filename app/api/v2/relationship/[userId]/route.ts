import { Relationship } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { NextResponse } from "next/server";
import { getUser, normalizeRelationship } from "../../utility";

export interface RelationshipGetResult {
  normalizedRelationship: Relationship | null;
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  if (targetUserId.length < 20 || targetUserId.length > 40) {
    throw new Error("User Profile ID format error");
  }

  const normalizedRelationships = await findNormalizedRelationships(
    user.id,
    targetUserId
  );

  if (normalizedRelationships.length > 1) {
    return new Response("More than one relationship found", { status: 500 });
  } else if (normalizedRelationships.length === 0) {
    return new Response(
      `You don't have a relationship with user ${targetUserId}`,
      { status: 404 }
    );
  } else {
    NextResponse.json({
      normalizedRelationship: normalizedRelationships[0],
    } as RelationshipGetResult);
  }
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
